import InputStream from "./input-stream";
import OutputStream from "./output-stream";

export default (input: InputStream, output: OutputStream): number => {
  let bytesWritten = 0;
  while (!input.isAtEnd()) {
    const instruction = input.getUint8();
    const values =
      instruction < 0x80
        ? input.getUint8Array(instruction + 1)
        : Array(1 + 0x100 - instruction).fill(input.getUint8());
    output.writeUint8Array(values);
    bytesWritten += values.length;
  }
  return bytesWritten;
};
