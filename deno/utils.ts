export const MAX_PAYLOAD_SIZE = 4_294_967_295;
export const MAX_OP_CODE = 65_535;

export function toUint(x: number, len: number): Uint8Array {
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

export function fromUint(data: Uint8Array): number {
  let parsed = 0;

  for (let i = 0, len = data.length; i < len; ++i) {
    parsed += (data[i]) * (Math.pow(256, i));
  }

  return parsed;
}
