import { InputStream } from "src/util";
import { Image } from "src/mighty-data/models";
import { Resource } from "../resource";

const { floor } = Math;

const fixUpColorPalette = (buffer: Uint8Array, bpc: number = 6) => {
  const length = floor(buffer.length / 4);
  const colorPalette = new Uint32Array(length);

  for (let i = 0; i < length; i++) {
    colorPalette[i] =
      (0xff << 24) | // alpha
      (buffer[i * bpc + 4] << 16) | // blue
      (buffer[i * bpc + 2] << 8) | // green
      (buffer[i * bpc + 0] << 0); // red
  }

  return colorPalette;
};

export default (_: Resource, input: InputStream): Image => {
  const colorPalette = fixUpColorPalette(input.getUint8Array(0x600));
  const width = input.getUint16();
  const height = input.getUint16();
  const pixels = input.getUint8Array(width * height);

  return new Image(width, height, pixels, colorPalette);
};
