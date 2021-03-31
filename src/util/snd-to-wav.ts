import InputStream from "./input-stream";
import OutputStream from "./output-stream";
import Stream from "./stream";
import {fault} from "fault";

const { floor } = Math;

function assert(expr: boolean, message: string, ...rest: any[]) {
  if (!expr) throw fault(message, ...rest);
}

// Ported to typescript from https://github.com/Hopper262/classic-mac-utils/blob/master/snd2wav.pl
export default function sndToWav(
  snd: ArrayBuffer | Uint8Array | string | SharedArrayBuffer
): ArrayBuffer {
  const input = new InputStream(
    snd instanceof Uint8Array ? snd.slice().buffer : snd
  );
  input.endianess = Stream.Endian.Big;

  let opts: number;
  let numbytes: number;
  let samplerate: number;
  let loopstart: number;
  let loopend: number;
  let bytesSample: number;
  let channels: number;
  let dataSize: number;
  let rate: number;
  let sampleEncoding: number;
  let baseFrequency: number;

  assert(input.getUint16() === 1, "Bad snd format");
  assert(input.getUint16() === 1, "Too many data types");
  assert(input.getUint16() === 5, "Only sampeld sound can be decoded");

  opts = input.getUint32();
  assert(
    opts === 0x80 || opts === 0xa0 || opts === 0x3a0,
    "Unhandled options in %2x",
    opts
  );

  assert(input.getUint16() === 1, "Too many commands");
  assert(input.getUint16() === 0x8051, "Not a buffer command");
  assert(input.getUint16() === 0, "Bad param1");
  assert(input.getUint32() === 20, "Bad param2");
  assert(input.getUint32() === 0, "Bad data pointer");

  numbytes = input.getUint32();
  samplerate = input.getUint32() / 65536.0;

  loopstart = input.getUint32();
  loopend = input.getUint32();

  sampleEncoding = input.getUint8();
  assert(
    sampleEncoding === 0,
    "Non-standard sample encoding %02x encountered",
    sampleEncoding
  );

  baseFrequency = input.getUint8();
  assert(
    baseFrequency === 0x3c || baseFrequency === 0x3b || baseFrequency === 0x48,
    "Weird base frequency %d encountered",
    baseFrequency
  );

  dataSize = numbytes;
  rate = floor(samplerate);
  bytesSample = 1;
  channels = 1;

  const output = new OutputStream(dataSize + 36 + 0x1000);
  output.writeCharacters("RIFF");
  output.writeUint32(dataSize + 36);
  output.writeCharacters("WAVE");
  output.writeCharacters("fmt ");
  output.writeUint32(16);
  output.writeUint16(1);
  output.writeUint16(channels);
  output.writeUint32(rate);
  output.writeUint32(rate * channels * bytesSample);
  output.writeUint16(channels * bytesSample);
  output.writeUint16(bytesSample * 8);
  output.writeCharacters("data");
  output.writeUint32(dataSize);

  for (let i = 0; i < numbytes; i++) {
    output.writeUint8(input.getUint8());
  }

  return output.buffer;
}
