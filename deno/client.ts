import { decode, encode } from "./cbor.ts";
import nanoid from "./nanoid.ts";
import { createPool, CreatePoolOptions } from "./pool.ts";
import { Channel, Data, OpCode, Role } from "./types/data.ts";
import { fromUint, MAX_OP_CODE, toUint } from "./utils.ts";

const now = performance.now();
let c = 0;

export async function createWorkerCache(
  options: {
    conn: Deno.ConnectOptions;
    pool: Omit<CreatePoolOptions<Deno.Conn>, "create" | "destroy">;
  },
) {
  const promises = new Map<string, { resolve: (data: Data) => void }>();

  const pool = await createPool({
    ...options.pool,
    create: async () => {
      const worker = new Worker(new URL("./worker.ts", import.meta.url).href, {
        type: "module",
        deno: {
          namespace: true,
          permissions: "inherit",
        },
      });

      await new Promise<void>((resolve) => {
        worker.onmessage = (event) => {
          if (event.data.t !== "Ready") {
            return;
          }

          worker.onmessage = (event) => {
            if (event.data.id) {
              promises.get(event.data.id)?.resolve(event.data);
              promises.delete(event.data.id);
            }
          };

          resolve();
        };
      });

      return worker;
    },
    destroy: async (conn) => {
      // conn.requests.forEach((req) => {
      //   req.reject();
      // });

      // conn.conn.close();
    },
  });

  const cache = {
    send: async function (data: Data): Promise<void> {
      const worker = await pool.acquire();
      worker.resource.postMessage({ t: "Send", d: data });

      pool.free(worker);

      c++;

      if (c % 1000 === 0) {
        console.log(c, "took", performance.now() - now);
      }
    },
    request: async function (data: Data): Promise<Data> {
      const id = nanoid();

      const worker = await pool.acquire();
      worker.resource.postMessage({ t: "Request", d: data, id });

      pool.free(worker);

      return new Promise<Data>((resolve, reject) => {
        promises.set(id, { resolve });
      });
    },
  };

  // This strange thing massively improve the performance of the worker based cache pool.
  await Promise.all(
    [new Array(options.pool.max - 1).keys()].map((_) =>
      cache.send({ op: OpCode.Hello, d: undefined })
    ),
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return cache;
}

export async function createCache(
  options: {
    conn: Deno.ConnectOptions;
    pool: Omit<CreatePoolOptions<Deno.Conn>, "create" | "destroy">;
  },
) {
  const pool = await createPool({
    ...options.pool,
    create: async () => {
      return await createConnection(options.conn);
    },
    destroy: async (conn) => {
      conn.requests.forEach((req) => {
        req.reject();
      });

      conn.conn.close();
    },
  });

  const cache = {
    send: async function (data: Data): Promise<void> {
      const conn = await pool.acquire();
      await send(conn.resource.conn, 0, data);
      pool.free(conn);

      c++;

      if (c % 1000 === 0) {
        console.log(c, "took", performance.now() - now);
      }
    },
    request: async function (data: Data): Promise<Data> {
      const conn = await pool.acquire();

      conn.resource.seq += 1;

      if (conn.resource.seq > MAX_OP_CODE) {
        conn.resource.seq = 0;
      }

      // TODO: timeout
      return new Promise<Data>(async (resolve, reject) => {
        conn.resource.requests.set(conn.resource.seq, { resolve, reject });
        await send(conn.resource.conn, conn.resource.seq, data);
        pool.free(conn);
      });
    },
  };

  for (let i = 0; i <= 10; ++i) {
    await cache.send({ op: OpCode.Hello, d: undefined });
  }

  await new Promise((resolve) => setTimeout(resolve, 100));

  return cache;
}

type Connection = {
  conn: Deno.Conn;
  requests: Map<number, { resolve: (data: Data) => void; reject: () => void }>;
  seq: number;
};

export async function createConnection(
  options: Deno.ConnectOptions,
): Promise<Connection> {
  const conn = await Deno.connect(options);
  const connection = {
    conn,
    requests: new Map(),
    seq: 0,
  };
  process(connection, options);

  await send(conn, 0, { op: OpCode.Identify, d: { user: "y" } });

  return connection;
}

async function process(conn: Connection, options: Deno.ConnectOptions) {
  try {
    while (true) {
      let lebu = new Uint8Array(4);

      {
        const n = await conn.conn.read(lebu);

        // TODO: confirm that n is 4

        // 0 or null are both bad
        if (!n) {
          conn.conn.close();

          break;
        }
      }

      {
        let op: number;
        {
          let buffer = new Uint8Array(2);
          const n = await conn.conn.read(buffer);

          // TODO: confirm n

          op = fromUint(buffer);
        }

        const toRead = fromUint(lebu) - 6;

        let buffer = new Uint8Array(toRead);
        const n = await conn.conn.read(buffer);

        if (!n) {
          conn.conn.close();

          break;
        }

        // TODO: confirm n is len

        // const parsed = new TextDecoder().decode(buffer);
        let data = decode<Data>(
          buffer,
        );

        const prom = conn.requests.get(op);
        if (!prom) continue;

        prom.resolve(data);
      }
    }
  } catch (e) {
    console.error(e);
    const newConn = await createConnection(options);
    conn.conn = newConn.conn;
    throw "f";
  }
}

export async function send(connection: Deno.Conn, op: number, data: Data) {
  const encoded = encode({ op: data.op, d: data.d });

  const len = encoded.length + 2 + 4;

  const lenUint = toUint(len, 4);
  const opUint = toUint(op, 2);

  const payload = new Uint8Array(len);
  payload.set(lenUint);
  payload.set(opUint, 4);
  payload.set(encoded, 6);

  await connection.write(payload);
}
