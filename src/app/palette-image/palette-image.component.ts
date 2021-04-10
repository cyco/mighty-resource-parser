import { Component, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-palette-image',
  templateUrl: './palette-image.component.html',
  styleUrls: ['./palette-image.component.scss']
})
export class PaletteImageComponent implements AfterViewInit {
  @Input()
  public width: number;
  @Input()
  public height: number;
  @Input()
  public palette: Uint8Array;
  @Input()
  public pixels: Uint8Array;
  @Input()
  public mask: Uint8Array;
  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.redraw();
  }

  ngOnChanges() {
    if (!this.context) {
      return;
    }
    this.redraw();
  }

  private redraw() {
    const { width, height, pixels, palette, mask } = this;
    if (!width || !height || !pixels || !palette) {
      return;
    }

    this.canvas.nativeElement.width = width;
    this.canvas.nativeElement.height = height;
    this.canvas.nativeElement.style.maxWidth = `${width}px`;
    this.canvas.nativeElement.style.maxHeight = `${height}px`;

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
    this.context.putImageData(result, 0, 0);
  }
}
