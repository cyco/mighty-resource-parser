import { SoundSheet } from "./models/sound-sheet";
import { Image } from "./models/image";
import { Map } from "./models/map";
import { Movie } from "./models/movie";
import { TileSheet } from "./models/tile-sheet";
import { ShapeSheet } from "./models/shape-sheet";

export class TypeDetector {
  public detect(file: string) {
    const [_, extension] = file.split(".");

    switch (extension.toLowerCase()) {
      case "sounds":
        return SoundSheet;
      case "image":
        return Image;
      case "tileset":
        return TileSheet;
      case "spin":
        return Movie;
      case "shapes":
        return ShapeSheet;
      case "map-1":
      case "map-2":
      case "map-3":
        return Map;
      default:
        return null;
    }
  }
}
