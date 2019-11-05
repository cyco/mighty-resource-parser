import { Component, OnChanges, Input } from "@angular/core";
import { TileSheet } from "src/mighty-data/models/tile-sheet";
import { ResourceManager } from "src/mighty-data/resource-manager";
import { Parser } from "src/mighty-data/parser/parser";
import { Image } from "src/mighty-data/models/image";

@Component({
  selector: "app-tileset-inspector",
  templateUrl: "./tileset-inspector.component.html",
  styleUrls: ["./tileset-inspector.component.scss"]
})
export class TilesetInspectorComponent implements OnChanges {
  @Input()
  public tileset: TileSheet;
  @Input()
  public resourceManager: ResourceManager;

  public palette: Uint32Array;
  private currentPaletteSource: string;
  public parser: Parser = new Parser();

  ngOnChanges() {
    if (!this.tileset) return;
    if (this.currentPaletteSource !== this.tileset.paletteSource) {
      this.resourceManager
        .get(this.tileset.paletteSource)
        .subscribe(resource => {
          this.currentPaletteSource = this.tileset.paletteSource;
          const x: Image = this.parser.parse(resource, this.resourceManager);
          this.palette = x.palette;
        });
    }
  }
}
