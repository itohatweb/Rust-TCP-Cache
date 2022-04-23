import { createConnection, send } from "./client.ts";
import { Data, OpCode } from "./types/data.ts";
import { MAX_OP_CODE } from "./utils.ts";

const context: Worker = self as any;

const connection = await createConnection({
  port: 6379,
});

context.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  switch (e.data.t) {
    case "Send": {
      await send(connection.conn, 0, e.data.d);

      break;
    }
    case "Request": {
      connection.seq += 1;
      if (connection.seq > MAX_OP_CODE) {
        connection.seq = 0;
      }

      const id = e.data.id;

      connection.requests.set(connection.seq, {
        resolve: (data) => {
          context.postMessage({ d: data, id });
        },
        reject: () => {},
      });

      await send(connection.conn, connection.seq, e.data.d);

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
