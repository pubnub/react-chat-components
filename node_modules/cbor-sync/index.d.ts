declare namespace CBOR {
  export function encode(data: any, format?: "buffer"): Buffer;
  export function encode(data: any, format: "hex"|"base64"): string;
  export function decode(data: Buffer, format?: "buffer"): any;
  export function decode(data: string, format: "hex"|"base64"): any;

  export function addSemanticEncode(tag: number, fn: (data: any) => any): any;
  export function addSemanticDecode(tag: number, fn: (data: any) => any): any;
}

export = CBOR;
