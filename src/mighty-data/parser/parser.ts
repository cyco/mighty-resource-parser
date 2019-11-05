import { Resource } from "../resource";
import { ResourceManager } from "../resource-manager";
import {
  Image,
  SoundSheet,
  ShapeSheet,
  Shape,
  ShapeSet,
  Map,
  TileSheet
} from "../models";
import {
  Stream,
  InputStream,
  OutputStream,
  decodeRLB,
  decodeRLW,
  decodeLZSS
} from "src/util";
import { ResourceFork } from "src/resource-fork";

enum CompressionType {
  RLB = 0,
  LZSS = 1,
  Plain = 2,
  RLW = 6
}

export class Parser {
  public parse(resource: Resource, manager: ResourceManager): any {
    const input = new InputStream(resource.contents);
    input.endianess = Stream.Endian.Big;
    return this.doParse(resource, input);
  }

  private unpack(stream: InputStream): InputStream {
    const unpackedSize = stream.getUint32();
    const type = stream.getUint32();
    const output = new OutputStream(unpackedSize);
    output.endianess = Stream.Endian.Big;
    const decode = this.decodeFor(type);
    decode(stream, output);

    const input = new InputStream(output.buffer);
    input.endianess = Stream.Endian.Big;
    return input;
  }

  private doParse(resource: Resource, input: InputStream) {
    switch (resource.type) {
      case SoundSheet:
        return this.parseSoundSheet(input);
      case Image:
        return this.parseImage(this.unpack(input));
      case ShapeSheet:
        return this.parseShapeSheet(resource, this.unpack(input));
      case TileSheet:
        return this.parseTileset(resource, this.unpack(input));
      case Map:
        return this.parseMap(resource, this.unpack(input));
    }

    return null;
  }

  private parseMap(resource: Resource, input: InputStream) {
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
    map.tilesheetSource = this.fixTilesetPath(
      resource.path.replace(/map-\d$/gi, "tileset").toLowerCase()
    );

    return map;
  }

  private fixTilesetPath(path: string) {
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
  }

  private parseTileset(resource: Resource, input: InputStream) {
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
  }

  private parseShapeSheet(resource: Resource, input: InputStream) {
    const unpackedSize = input.getUint32();
    const unpackedType = input.getUint32();
    const setCount = input.getUint16();
    const offsets = [];
    for (let i = 0; i < setCount; i++) {
      offsets.push(input.getUint32());
    }

    const sets = [];
    for (let offset of offsets) {
      input.seek(offset, Stream.Seek.Set);
      sets.push(this.parseShapeSet(input));
    }
    const result = new ShapeSheet();
    result.sets = sets;
    result.paletteSource = this.determinePaletteSourceForShapes(resource.path);
    return result;
  }

  private determinePaletteSourceForShapes(path: string) {
    switch (path) {
      case "Shapes/OverheadMap.shapes":
        return "Images/OverheadMap.image";
      case "Shapes/title.shapes":
        return "Images/titlepage.image";
      case "Shapes/view.shapes":
        return "Images/ViewPPC.image";
        return "Images/Head.image";
      default:
        return "Images/Border.image";
    }
  }

  private parseShapeSet(input: InputStream) {
    const offset = input.offset;

    let shapeSheet = new ShapeSet();
    shapeSheet.unknown1 = input.getUint8();
    shapeSheet.unknown2 = input.getUint8();
    shapeSheet.ten = input.getUint32();
    shapeSheet.unknown3 = input.getUint32();

    const shapeCount = input.getUint16();
    input.seek(offset - shapeCount * 16, Stream.Seek.Set);
    shapeSheet.shapes = [];
    for (let i = 0; i < shapeCount; i++) {
      shapeSheet.shapes.push(this.parseShape(input, offset));
    }

    return shapeSheet;
  }

  private parseShape(input: InputStream, base: number): Shape {
    const shape = new Shape();
    shape.width = input.getUint16();
    shape.height = input.getUint16();
    shape.anchorX = input.getInt16();
    shape.anchorY = input.getInt16();

    const pixelShift = input.getInt16();
    const relativePixelOffset = input.getInt16();
    const pixelOffset =
      base +
      relativePixelOffset +
      (relativePixelOffset < 0 ? (pixelShift + 1) << 16 : pixelShift << 16);
    const maskShift = input.getInt16();
    const relativeMaskOffset = input.getInt16();
    const maskOffset =
      base +
      relativeMaskOffset +
      (relativeMaskOffset < 0 ? (maskShift + 1) << 16 : maskShift << 16);
    const offset = input.offset;
    const size = shape.width * shape.height;
    input.seek(pixelOffset, Stream.Seek.Set);
    shape.pixels = input.getUint8Array(size);
    if (maskShift != 0) {
      input.seek(maskOffset, Stream.Seek.Set);
      shape.mask = input.getUint8Array(size);
    } else shape.mask = new Uint8Array(size);
    input.seek(offset, Stream.Seek.Set);
    return shape;
  }

  private parseSoundSheet(input: InputStream): SoundSheet {
    const resourceFork = new ResourceFork(input);

    return new SoundSheet(resourceFork);
  }

  private parseImage(input: InputStream): Image {
    const colorPalette = this.fixUpPalette(input.getUint8Array(0x600));
    const width = input.getUint16();
    const height = input.getUint16();
    const pixels = input.getUint8Array(width * height);

    return new Image(width, height, pixels, colorPalette);
  }

  private fixUpPalette(buffer: Uint8Array, bpc: number = 6) {
    const length = Math.floor(buffer.length / 4);
    const colorPalette = new Uint32Array(length);

    for (let i = 0; i < length; i++) {
      colorPalette[i] =
        (0xff << 24) | // alpha
        (buffer[i * bpc + 4] << 16) | // blue
        (buffer[i * bpc + 2] << 8) | // green
        (buffer[i * bpc + 0] << 0); // red
    }

    return colorPalette;
  }

  private decodeFor(type: CompressionType) {
    switch (type) {
      case CompressionType.Plain:
        return (input: InputStream, output: OutputStream) =>
          output.writeUint8Array(input.getUint8Array(output.size));
      case CompressionType.RLB:
        return decodeRLB;
      case CompressionType.RLW:
        return decodeRLW;
      case CompressionType.LZSS:
        return decodeLZSS;
    }
  }
}
