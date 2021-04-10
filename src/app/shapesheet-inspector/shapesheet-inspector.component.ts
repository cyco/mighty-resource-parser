import { Component, Input, OnChanges } from '@angular/core';
import { ShapeSheet } from 'src/mighty-data/models/shape-sheet';
import { ResourceManager } from 'src/mighty-data/resource-manager';

@Component({
  selector: 'app-shapesheet-inspector',
  templateUrl: './shapesheet-inspector.component.html',
  styleUrls: ['./shapesheet-inspector.component.scss']
})
export class ShapesheetInspectorComponent implements OnChanges {
  @Input()
  public shapesheet: ShapeSheet;
  @Input()
  public resourceManager: ResourceManager;

  public palette: Uint32Array;
  private currentPaletteSource: string;

  ngOnChanges() {
    if (!this.shapesheet) {
      return;
    }
    if (this.currentPaletteSource !== this.shapesheet.paletteSource) {
      this.resourceManager.get(this.shapesheet.paletteSource).subscribe(resource => {
        this.currentPaletteSource = this.shapesheet.paletteSource;
        this.palette = resource.contents.palette;
      });
    }
  }
}
