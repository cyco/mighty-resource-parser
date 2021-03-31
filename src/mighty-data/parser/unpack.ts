import {
  InputStream,
  OutputStream,
  Stream,
  decodeRLB,
  decodeRLW,
  decodeLZSS
} from 'src/util';

enum CompressionType {
  RLB = 0,
  LZSS = 1,
  PlainText = 2,
  RLW = 6
}

const decoders = {
  [CompressionType.RLB]: decodeRLB,
  [CompressionType.RLW]: decodeRLW,
  [CompressionType.LZSS]: decodeLZSS,
  [CompressionType.PlainText]: (input: InputStream, output: OutputStream) =>
    output.writeUint8Array(input.getUint8Array(output.size))
};

export default (stream: InputStream): InputStream => {
  const unpackedSize = stream.getUint32();
  const type = stream.getUint32() as CompressionType;
  const output = new OutputStream(unpackedSize, Stream.Endian.Big);

  decoders[type](stream, output);

  return new InputStream(output.buffer, Stream.Endian.Big);
};
