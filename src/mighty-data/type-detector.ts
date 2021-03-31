import { Injectable } from '@angular/core';
import { SoundSheet, Image, Map, Movie, TileSheet, ShapeSheet } from './models';

@Injectable({ providedIn: 'root' })
export class TypeDetector {
  private extensionMap = {
    sounds: SoundSheet,
    image: Image,
    tileset: TileSheet,
    spin: Movie,
    shapes: ShapeSheet,
    'map-1': Map,
    'map-2': Map,
    'map-3': Map
  };

  public detect(file: string) {
    const [name, extension] = file.split('.');

    if (name === 'Audio/Music') {
      return SoundSheet;
    }

    return this.extensionMap[extension.toLowerCase()] || null;
  }
}
