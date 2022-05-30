import { createConnection, send } from "./client.ts";
import { Data, OpCode } from "./types/data.ts";
import { MAX_OP_CODE } from "./utils.ts";

const context: Worker = self as any;

let connection = await createConnection({
  port: 6379,
});

context.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  switch (e.data.t) {
    case "Send": {
      try {
        // await send(connection.conn, 65_535, e.data.d);
        sendQueue(0, e.data.d);
      } catch (e) {
        console.error(e);
      }

      break;
    }
    case "Request": {
      connection.seq += 1;
      if (connection.seq > MAX_OP_CODE) {
        connection.seq = 1;
      }

      const id = e.data.id;

      connection.requests.set(connection.seq, {
        resolve: (data) => {
          context.postMessage({ d: data, id });
        },
        reject: () => {},
      });

      try {
        // await send(connection.conn, connection.seq, e.data.d);
        sendQueue(connection.seq, e.data.d);
      } catch (e) {
        console.error(e);
      }

      break;
    }
  }
};

context.postMessage({ t: "Ready" });

type WorkerMessage = {
  t: "Send";
  d: Data;
} | {
  t: "Request";
  d: Data;
  id: string;
};

const queue: any[] = [];
let processing = false;

function sendQueue(op: number, payload: any) {
  queue.push({ op, payload });

  if (processing) {
    return;
  }

  processQueue();
}

async function processQueue() {
  processing = true;

  do {
    const payload = queue.shift();

    if (!payload) {
      processing = false;

      return;
    }

    await send(connection.conn, payload.op, payload.payload);
  } while (queue.length > 0);

  processing = false;
}
