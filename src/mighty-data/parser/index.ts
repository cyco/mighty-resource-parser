import { Resource } from "../resource";
import { ResourceManager } from "../resource-manager";
import { Image, SoundSheet, ShapeSheet, Map, TileSheet } from "../models";
import {
  Stream,
  InputStream,
  OutputStream,
  decodeRLB,
  decodeRLW,
  decodeLZSS
} from "src/util";
import parseImage from "./parse-image";
import parseMap from "./parse-map";
import parseTileset from "./parse-tileset";
import parseSoundSheet from "./parse-sound-sheet";
import parseShapeSheet from "./parse-shape-sheet";

enum CompressionType {
  RLB = 0,
  LZSS = 1,
  Plain = 2,
  RLW = 6
}

export class Parser {
  public parse(resource: Resource, _: ResourceManager): any {
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
        return parseSoundSheet(input);
      case Image:
        return parseImage(this.unpack(input));
      case ShapeSheet:
        return parseShapeSheet(resource, this.unpack(input));
      case TileSheet:
        return parseTileset(resource, this.unpack(input));
      case Map:
        return parseMap(resource, this.unpack(input));
    }

    return null;
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
