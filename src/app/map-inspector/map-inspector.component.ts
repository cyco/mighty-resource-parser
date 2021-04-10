import { Component, Input, OnChanges, SimpleChanges, NgZone, ViewChild, ElementRef } from '@angular/core';
import { TileSheet } from 'src/mighty-data/models/tile-sheet';
import { Map } from 'src/mighty-data/models/map';
import { ResourceManager } from 'src/mighty-data/resource-manager';

@Component({
  selector: 'app-map-inspector',
  templateUrl: './map-inspector.component.html',
  styleUrls: ['./map-inspector.component.scss']
})
export class MapInspectorComponent implements OnChanges {
  @Input()
  public resourceManager: ResourceManager;
  @Input()
  public map: any;
  @Input()
  public tilesheet: TileSheet;
  @Input()
  public palette: Uint32Array;

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;
  constructor(private zone: NgZone) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('map' in changes) {
      this.resourceManager.get(this.map.tilesheetSource).subscribe(
        this.runHack(ts => {
          this.tilesheet = ts.contents;
          this.resourceManager.get(this.tilesheet.paletteSource).subscribe(
            this.runHack(image => {
              this.palette = image.contents.palette;
              this.redraw();
            })
          );
        })
      );
    }

    if (!this.context) {
      return;
    }
    this.redraw();
  }

  private runHack(cb: (...args: any[]) => void): () => void {
    return (...args: any[]) => this.zone.run(() => setTimeout(cb, 0, ...args));
  }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.redraw();
  }

  private redraw() {
    const { palette, map, tilesheet } = this;
    if (!palette || !map || !tilesheet) {
      return;
    }

    this.context.putImageData(this.draw(map), 0, 0);
  }

  draw(map: Map) {
    console.log('draw');

    const TileWidth = 32;
    const TileHeight = 32;
    const ZoneWidth = map.width;
    const ZoneHeight = map.height;

    const palette = this.palette;
    const result = new ImageData(ZoneWidth * TileWidth, ZoneHeight * TileHeight);
    const buffer = new ArrayBuffer(result.data.length);
    const byteArray = new Uint8Array(buffer);
    const data = new Uint32Array(buffer);
    const bpr = ZoneWidth * TileWidth;

    for (let y = 0; y < ZoneHeight; y++) {
      for (let x = 0; x < ZoneWidth; x++) {
        const tileId = map.tiles[y * ZoneWidth + x];
        const pixels = this.tilesheet.tiles[tileId];
        if (!pixels) {
          console.log('Tile', tileId, 'of', this.tilesheet.tiles.length);
        }
        if (!pixels) {
          continue;
        }

        const sy = y * TileHeight;
        const sx = x * TileWidth;
        let j = sy * bpr + sx;

        for (let ty = 0; ty < TileHeight; ty++) {
          for (let tx = 0; tx < TileWidth; tx++) {
            const i = ty * TileWidth + tx;
            data[j + tx] = palette[pixels[i]];
          }

          j += bpr;
        }
      }
    }
    result.data.set(byteArray);

    return result;
  }
}
