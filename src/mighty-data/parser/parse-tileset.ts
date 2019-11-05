import { TileSheet } from "../models";
import { InputStream } from "src/util";
import { Resource } from "../resource";

export default (resource: Resource, input: InputStream) => {
  const intro = input.getUint16Array(4);
  const pixelsOffset = input.getUint16() + 2;
  const offset2Garbage = input.getUint16();
  const offset2 = input.getUint16();
  const offset3Garbage = input.getUint16();
  const offset3 = input.getUint16();
  const unknownGarbage = input.getUint16();
  const unknown = input.getUint16();
  const animationOffsetGarbage = input.getUint16();
  const animationOffset = input.getUint16();
  const offset4Garbage = input.getUint16();
  const offset4 = input.getUint16();
  const headerCount = input.getUint16();
  const headers = Array.from({ length: headerCount }).map(() =>
    input.getCharacters(0x100).trim()
  );
  const tileImageCount = input.getUint16();
  const tileImages = Array.from({ length: tileImageCount }).map(() =>
    input.getUint8Array(0x400)
  );

  const tileCount = input.getUint16();
  const tiles = Array.from({ length: tileCount }).map(
    () => tileImages[input.getUint16()]
  );

  const tileset = new TileSheet();
  tileset.tiles = tiles;
  tileset.tileImages = tileImages;
  tileset.paletteSource = "Images/Border.image";
  return tileset;
};
