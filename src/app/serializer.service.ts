import { Injectable } from '@angular/core';
import { TileSheet, Image, ShapeSheet, ShapeSet, Shape } from 'src/mighty-data/models';
import { Resource } from 'src/mighty-data/resource';
import { ResourceManager } from 'src/mighty-data/resource-manager';
import { download, downloadImage } from 'src/util';
import JSZip from 'jszip';

@Injectable({
  providedIn: 'root'
})
export class SerializerService {
  constructor(private resourceManager: ResourceManager) {}

  public async download(resource: Resource): Promise<void> {
    if (resource.type === TileSheet) {
      await this.downloadTilesheet(resource);
    }
    if (resource.type === ShapeSheet) {
      await this.downloadShapeSheet(resource);
    }
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
          data[(ty + y * TileSize) * imageWidth + (tx + x * TileSize)] = palette[pixels[ty * TileSize + tx]];
        }
      }
    }
    image.data.set(byteArray);

    const name = resource.path.split('/')[1].split('.')[0];
    downloadImage(image, `${name}-tileset.png`, 'png');
  }

  private async downloadShapeSheet(resource: Resource) {
    const shapeSheet = resource.contents as ShapeSheet;

    const paletteSourceImageResource = await this.resourceManager.get(shapeSheet.paletteSource).toPromise();
    const paletteSourceImage = paletteSourceImageResource.contents as Image;
    const palette = paletteSourceImage.palette;

    const zip = new JSZip();

    for (let i = 0; i < shapeSheet.sets.length; i++) {
      const shapeSet = shapeSheet.sets[i];
      const name = `shape-${i}`;
      const folder = zip.folder(`shape-${i}`);
      for (let j = 0; j < shapeSet.shapes.length; j++) {
        const shape = shapeSet.shapes[j];
        const fileName = name + '-' + j + '.png';
        folder.file(fileName, this.drawShape(shape, palette), { base64: true });
      }
    }

    const result = await zip.generateAsync({ type: 'arraybuffer' });
    download(result, resource.path.split('/')[1].split('.')[0] + '-shapes.zip');
  }

  private drawShape(shape: Shape, palette: Uint32Array) {
    const { width, height, pixels, mask } = shape;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    const result = new ImageData(width, height);
    const buffer = new ArrayBuffer(result.data.length);
    const byteArray = new Uint8Array(buffer);
    const data = new Uint32Array(buffer);

    if (mask) {
      for (let ty = 0; ty < height; ty++) {
        for (let tx = 0; tx < width; tx++) {
          const idx = ty * width + tx;
          data[ty * width + tx] = !mask[idx] ? palette[pixels[idx]] : 0;
        }
      }
    } else {
      for (let ty = 0; ty < height; ty++) {
        for (let tx = 0; tx < width; tx++) {
          data[ty * width + tx] = palette[pixels[ty * width + tx]];
        }
      }
    }

    result.data.set(byteArray);
    context.putImageData(result, 0, 0);

    return canvas.toDataURL('png').substr(22);
  }

  public canSerialize(resource: Resource): boolean {
    return resource.type === TileSheet || resource.type === ShapeSheet;
  }
}
