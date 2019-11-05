import { Map } from "../models";
import { Stream, InputStream } from "src/util";
import { Resource } from "../resource";

const fixTilesetPath = (path: string) => {
  switch (path) {
    case "maps/bargain.tileset":
      return "Maps/Bargain.Tileset";
    case "maps/candy.tileset":
      return "Maps/Candy.tileset";
    case "maps/clown.tileset":
      return "Maps/Clown.tileset";
    case "maps/fairy.tileset":
      return "Maps/Fairy.Tileset";
    case "maps/jurassic.tileset":
      return "Maps/Jurassic.tileset";
  }
};

export default (resource: Resource, input: InputStream) => {
  const unknown1 = input.getUint16();
  const offset = input.getUint32();
  input.seek(offset, Stream.Seek.Set);
  const width = input.getUint16();
  const height = input.getUint16();
  const offset2 = input.getUint32();
  const getAltTileId = (x: number, y: number, bytesPerTile = 2): number => {
    input.seek(
      offset + 4 + y * width * bytesPerTile + bytesPerTile * x,
      Stream.Seek.Set
    );
    return input.getUint16() & 0x07ff;
  };

  const tiles = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      tiles.push(getAltTileId(x, y));
    }
  }

  const items = Array.from({ length: input.getUint16() }).map(() => {
    const x = input.getUint32() >> 5;
    const y = input.getUint32() >> 5;
    const type = input.getUint16();
    const rest = input.getUint8Array(0x4);
    return { x, y, type, rest };
  });

  const map = new Map();
  map.width = width;
  map.height = height;
  map.tiles = tiles;
  map.items = items;
  map.tilesheetSource = fixTilesetPath(
    resource.path.replace(/map-\d$/gi, "tileset").toLowerCase()
  );

  return map;
};
