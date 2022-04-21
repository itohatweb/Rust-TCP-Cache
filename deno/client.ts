import { decode, encode } from "./cbor.ts";
import { createPool, CreatePoolOptions } from "./pool.ts";
import { Data } from "./types/data.ts";
import { fromUint, MAX_OP_CODE, toUint } from "./utils.ts";

export function createCache(
  options: {
    conn: Deno.ConnectOptions;
    pool: Omit<CreatePoolOptions<Deno.Conn>, "create" | "destroy">;
  },
) {
  const pool = createPool({
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

  return {
    send: async function (data: Data): Promise<void> {
      const conn = await pool.acquire();
      await send(conn.resource.conn, 0, data);
      pool.free(conn);
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
}

type Connection = {
  conn: Deno.Conn;
  requests: Map<number, { resolve: (data: Data) => void; reject: () => void }>;
  seq: number;
};

async function createConnection(
  options: Deno.ConnectOptions,
): Promise<Connection> {
  const conn = await Deno.connect(options);
  const connection = {
    conn,
    requests: new Map(),
    seq: 0,
  };
  process(connection, options);

  await send(conn, 0, { t: "Identify", d: { user: "y" } });

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
  }
}

async function send(connection: Deno.Conn, op: number, data: Data) {
  const encoded = encode(data);

  const len = encoded.length + 2 + 4;

  const lenUint = toUint(len, 4);
  const opUint = toUint(op, 2);

  const payload = new Uint8Array(len);
  payload.set(lenUint);
  payload.set(opUint, 4);
  payload.set(encoded, 6);

  await connection.write(payload);
}

const cache = createCache({ conn: { port: 6379 }, pool: { max: 1 } });

// const now2 = performance.now();
// // @ts-ignore
// const res2 = await cache.send(fakeGuild());
// console.log(`took: ${performance.now() - now2}`);
// console.log({ res2 });

// const now3 = performance.now();
// // @ts-ignore
// const res3 = await cache.send(fakeGuild());
// console.log(`took: ${performance.now() - now3}`);
// console.log({ res3 });

// const d = { hey: true };
const raw = {
  "id": 223909216866402304n,
  "name": "Dligence",
  "icon": "308a4387b88a5988309c0ff9634e13cd",
  "description": null,
  "splash": null,
  "discovery_splash": null,
  "features": [
    "MEMBER_VERIFICATION_GATE_ENABLED",
    "NEWS",
    "WELCOME_SCREEN_ENABLED",
    "NEW_THREAD_PERMISSIONS",
    "THREADS_ENABLED",
    "PREVIEW_ENABLED",
    "COMMUNITY",
  ],
  "banner": null,
  "owner_id": 130136895395987456n,
  "application_id": null,
  "region": "us-east",
  "afk_channel_id": null,
  "afk_timeout": 300,
  "system_channel_id": null,
  "widget_enabled": true,
  "widget_channel_id": 450041734307512321n,
  "verification_level": 2,
  "default_message_notifications": 1,
  "mfa_level": 1,
  "explicit_content_filter": 2,
  "max_presences": null,
  "max_members": 500000,
  "max_video_channel_users": 25,
  "vanity_url_code": null,
  "premium_tier": 0,
  "premium_subscription_count": 1,
  "system_channel_flags": 1,
  "preferred_locale": "en-US",
  "rules_channel_id": 273389739091165184n,
  "public_updates_channel_id": 637995617452425226n,
  "hub_type": null,
  "premium_progress_bar_enabled": true,
  "nsfw": false,
  "nsfw_level": 0,
  "large": false,
};
async function foo() {
  // const res = await cache.request({
  //   // @ts-ignore
  //   t: "Nani",
  //   // @ts-ignore
  //   d: 785384884197392384n,
  // });
  // @ts-ignore
  // const res = await cache.request({ t: "CacheGuild", d: raw });
  const res = await cache.request({ t: "GetStats" });
  console.log({ res });
}

foo();

// for (let i = 0; i < 100; ++i) {
//   foo();
//   // await new Promise((res) => setTimeout(res, 2000));
// }

// const ruf = [...Array(1_000).keys()].map(async (_) => {
//   // const now = performance.now();
//   await foo();
//   // console.log(`took: ${performance.now() - now}`);
// });

// const now = performance.now();
// await Promise.all(ruf);
// console.log(`took: ${performance.now() - now}`);

// #######################################################################################
