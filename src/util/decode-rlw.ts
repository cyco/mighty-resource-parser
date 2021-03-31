import InputStream from './input-stream';
import OutputStream from './output-stream';

export default (input: InputStream, output: OutputStream) => {
  let bytesWritten = 0;
  while (!input.isAtEnd()) {
    const instruction = input.getUint8();
    if ((instruction & 0x80) === 0) {
      for (let i = 0; i < instruction + 1; i++) {
        output.writeUint16(input.getUint16());
      }
      bytesWritten += 2 * (instruction + 1);
    } else {
      const value = input.getUint16();
      for (let i = 0; i < 1 + (instruction & 0x7f); i++) {
        output.writeUint16(value);
        bytesWritten += 2;
      }
    }
  }

  return bytesWritten;
};
