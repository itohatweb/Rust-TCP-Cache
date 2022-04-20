// const dat = new TextEncoder().encode("abcc");
// console.log(dat.length);

// const c = await Deno.connect({ port: 6379 });

// const wr = new Uint8Array([
//   ...new Uint8Array([dat.length + 4, 0, 0, 0]),
//   ...dat,
// ]);

// console.log({ wr });
// await c.write(wr);

// const dat2 = new TextEncoder().encode("d");
// const sr = new Uint8Array([
//   ...new Uint8Array([dat2.length + 4, 0, 0, 0]),
//   ...dat,
// ]);

// await c.write(wr);

import { Decoder, Encoder } from "https://deno.land/x/cbor@v1.2.1/index.js";
import { Data } from "./types/data.ts";
const decoder = new Decoder({
  useRecords: false,
});

const encoder = new Encoder({
  useRecords: false,
});

async function createConnection(options: Deno.ConnectOptions) {
  const connection = await Deno.connect(options);
  process(connection);
  await send(connection, 0, { t: "Identify", d: { user: "y" } });
}

createConnection({ port: 6379 });

async function process(connection: Deno.Conn) {
  while (true) {
    let lebu = new Uint8Array(4);

    {
      const n = await connection.read(lebu);

      // TODO: confirm that n is 4

      // 0 or null are both bad
      if (!n) {
        connection.close();

        break;
      }
    }

    {
      let op: number;
      {
        let buffer = new Uint8Array(2);
        const n = await connection.read(buffer);

        // TODO: confirm n

        op = fromUint(buffer);
      }

      console.log({ op });

      const toRead = fromUint(lebu) - 6;

      let buffer = new Uint8Array(toRead);
      const n = await connection.read(buffer);

      if (!n) {
        connection.close();

        break;
      }

      // TODO: confirm n is len

      // const parsed = new TextDecoder().decode(buffer);
      console.log({ buffer });
      let data = decoder.decode(
        buffer,
        // new Uint8Array([222, 0, 1, 164, 107, 105, 110, 100, 0]),
      );
      console.log({ data });
    }
  }
}

async function send(connection: Deno.Conn, op: number, data: Data) {
  const encoded = encoder.encode(data);

  const len = encoded.length + 2 + 4;

  const lenUint = toUint(len, 4);
  const opUint = toUint(op, 2);

  const payload = new Uint8Array([...lenUint, ...opUint, ...encoded]);

  console.log({ payload });
  await connection.write(payload);
}

// const c=await Deno.connect({port: 10000, transport: "tcp", hostname: "127.0.0.1"});
// await c.write(new TextEncoder().encode(getRandomMessage()));
// while(1) {
//     let buf=new Uint8Array(50);
//     const n=await c.read(buf) || 0;
//     buf=buf.slice(0, n);
//     console.log('B >> ', new TextDecoder().decode(buf));
//     const msg=getRandomMessage();
//     console.log('A >> ', msg);
//     if(msg === 'exit') {
//         c.close();
//         break;
//     }
//     await c.write(new TextEncoder().encode(msg));
// }

const MAX_PAYLOAD_SIZE = 4_294_967_295;
const MAX_OP_CODE = 65_535;

function toUint(x: number, len: number): Uint8Array {
  if (x > MAX_PAYLOAD_SIZE) {
    throw new Error(`Payload size too big: ${x} `);
  }

  const bin = [];

  while (x !== 0) {
    const rem = x % 256;
    x = Math.floor(x / 256);

    if (x === 0 && rem === 0) {
      break;
    }

    bin.push(rem);
  }

  while (bin.length < len) {
    bin.push(0);
  }

  return new Uint8Array(bin);
}

function fromUint(data: Uint8Array): number {
  let parsed = 0;

  for (let i = 0, len = data.length; i < len; ++i) {
    parsed += (data[i]) * (Math.pow(256, i));
  }

  return parsed;
}
