import { Resource } from "../resource";
import { ResourceManager } from "../resource-manager";
import {
  Image,
  SoundSheet,
  ShapeSheet,
  TileSheet,
  Map as MapModel
} from "../models";
import { Stream, InputStream } from "src/util";
import parseImage from "./parse-image";
import parseMap from "./parse-map";
import parseTileset from "./parse-tileset";
import parseSoundSheet from "./parse-sound-sheet";
import parseShapeSheet from "./parse-shape-sheet";
import unpack from "./unpack";
import { Injectable } from "@angular/core";

type ModelParser = (resource: Resource, input: InputStream) => any;

@Injectable({ providedIn: "root" })
export class Parser {
  private parsers = new Map<any, ModelParser>([
    [TileSheet, parseTileset],
    [SoundSheet, parseSoundSheet],
    [ShapeSheet, parseShapeSheet],
    [Image, parseImage],
    [MapModel, parseMap]
  ]);

  public parse(resource: Resource, _: ResourceManager): any {
    const parse = this.parsers.get(resource.type);
    let input = new InputStream(resource.contents, Stream.Endian.Big);
    input = parse !== parseSoundSheet ? unpack(input) : input;

    return parse(resource, input);
  }
}
