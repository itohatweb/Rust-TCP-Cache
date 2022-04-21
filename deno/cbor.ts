import { addExtension, Decoder, Encoder } from "./deps.ts";

// addExtension({
// 	Class: BigInt,
// 	tag: 43311, // register our own extension code (a tag code)
// 	encode(instance, encode) {
// 		// define how your custom class should be encoded
// 		encode(instance.myData); // return a buffer
// 	}
// 	decode(data) {
// 		// define how your custom class should be decoded
// 		let instance = new MyCustomClass();
// 		instance.myData = data
// 		return instance; // decoded value from buffer
// 	}
// });

const decoder = new Decoder({
  useRecords: false,
  largeBigIntToFloat: false,
});

const encoder = new Encoder({
  useRecords: false,
  largeBigIntToFloat: false,
});

export function decode<T>(data: Uint8Array): T {
  return decoder.decode(data);
}

export function encode<T>(data: T): Uint8Array {
  return encoder.encode(data);
}
