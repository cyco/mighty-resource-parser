import { Component, Input, OnChanges, SimpleChanges, NgZone, ViewChild, ElementRef } from '@angular/core';
import { TileSheet } from 'src/mighty-data/models/tile-sheet';
import { Map } from 'src/mighty-data/models/map';
import { ResourceManager } from 'src/mighty-data/resource-manager';
import { SerializerService } from '../serializer.service';

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
  constructor(private zone: NgZone, private serializer: SerializerService) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('map' in changes) {
      this.redraw();
    }

    if (!this.context) {
      return;
    }

    this.redraw();
  }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.redraw();
  }

  private redraw() {
    if (!this.map) {
      return;
    }

    this.serializer.drawMapImage(this.map).then(image => {
      this.context.putImageData(image, 0, 0);
    });
  }
}
