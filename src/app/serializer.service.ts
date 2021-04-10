import { Injectable } from '@angular/core';
import {TileSheet, Image} from 'src/mighty-data/models';
import {Resource} from 'src/mighty-data/resource';
import {ResourceManager} from 'src/mighty-data/resource-manager';
import {downloadImage} from 'src/util';

@Injectable({
  providedIn: 'root'
})
export class SerializerService {
  constructor(private resourceManager: ResourceManager) { }

  public async download(resource: Resource): Promise<void> {
    if(resource.type === TileSheet) await this.downloadTilesheet(resource);
  }


  private async downloadTilesheet(resource: Resource) {
    const TileSize = 32;
    const tilesheet = resource.contents as TileSheet;

    const paletteSourceImageResource = await this.resourceManager.get(tilesheet.paletteSource).toPromise();
    const paletteSourceImage = paletteSourceImageResource.contents as Image;
    const palette = paletteSourceImage.palette;

    const tilesWide = 20;
    const tilesHigh = Math.ceil(tilesheet.tileImages.length / tilesWide);
    const imageWidth = TileSize * tilesWide;
    const imageHeight = TileSize * tilesHigh;

    const image = new ImageData(imageWidth, imageHeight);
    const buffer = new ArrayBuffer(image.data.length);
    const byteArray = new Uint8Array(buffer);
    const data = new Uint32Array(buffer);

    for (let i = 0; i < tilesheet.tileImages.length; i++) {
      const pixels = tilesheet.tileImages[i];
      const x = i % tilesWide;
      const y = Math.floor(i / tilesWide);

      for (let ty = 0; ty < TileSize; ty++) {
        for (let tx = 0; tx < TileSize; tx++) {
          data[(ty + (y * TileSize)) * imageWidth + (tx + x * TileSize)] = palette[pixels[ty * TileSize + tx]];
        }
      }
    }
    image.data.set(byteArray);

    const name = resource.path.split("/")[1].split(".")[0];
    downloadImage(image, `${name}-tileset.png`, 'png');
  }

  public canSerialize(resource: Resource): boolean {
    return resource.type === TileSheet;
  }
}
