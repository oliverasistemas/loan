/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "loan.loan";

export interface Loan {
  id: number;
  amount: string;
  fee: string;
  collateral: string;
  deadline: string;
  state: string;
  borrower: string;
  lender: string;
}

function createBaseLoan(): Loan {
  return { id: 0, amount: "", fee: "", collateral: "", deadline: "", state: "", borrower: "", lender: "" };
}

export const Loan = {
  encode(message: Loan, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint64(message.id);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    if (message.fee !== "") {
      writer.uint32(26).string(message.fee);
    }
    if (message.collateral !== "") {
      writer.uint32(34).string(message.collateral);
    }
    if (message.deadline !== "") {
      writer.uint32(42).string(message.deadline);
    }
    if (message.state !== "") {
      writer.uint32(50).string(message.state);
    }
    if (message.borrower !== "") {
      writer.uint32(58).string(message.borrower);
    }
    if (message.lender !== "") {
      writer.uint32(66).string(message.lender);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Loan {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoan();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.amount = reader.string();
          break;
        case 3:
          message.fee = reader.string();
          break;
        case 4:
          message.collateral = reader.string();
          break;
        case 5:
          message.deadline = reader.string();
          break;
        case 6:
          message.state = reader.string();
          break;
        case 7:
          message.borrower = reader.string();
          break;
        case 8:
          message.lender = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Loan {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      amount: isSet(object.amount) ? String(object.amount) : "",
      fee: isSet(object.fee) ? String(object.fee) : "",
      collateral: isSet(object.collateral) ? String(object.collateral) : "",
      deadline: isSet(object.deadline) ? String(object.deadline) : "",
      state: isSet(object.state) ? String(object.state) : "",
      borrower: isSet(object.borrower) ? String(object.borrower) : "",
      lender: isSet(object.lender) ? String(object.lender) : "",
    };
  },

  toJSON(message: Loan): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.amount !== undefined && (obj.amount = message.amount);
    message.fee !== undefined && (obj.fee = message.fee);
    message.collateral !== undefined && (obj.collateral = message.collateral);
    message.deadline !== undefined && (obj.deadline = message.deadline);
    message.state !== undefined && (obj.state = message.state);
    message.borrower !== undefined && (obj.borrower = message.borrower);
    message.lender !== undefined && (obj.lender = message.lender);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Loan>, I>>(object: I): Loan {
    const message = createBaseLoan();
    message.id = object.id ?? 0;
    message.amount = object.amount ?? "";
    message.fee = object.fee ?? "";
    message.collateral = object.collateral ?? "";
    message.deadline = object.deadline ?? "";
    message.state = object.state ?? "";
    message.borrower = object.borrower ?? "";
    message.lender = object.lender ?? "";
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
