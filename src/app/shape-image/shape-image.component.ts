import { Component, Input } from "@angular/core";
import { Shape } from "src/mighty-data/models/shape";

@Component({
  selector: "app-shape-image",
  templateUrl: "./shape-image.component.html",
  styleUrls: ["./shape-image.component.scss"]
})
export class ShapeImageComponent {
  @Input()
  public shape: Shape;
  @Input()
  public palette: Uint32Array;
}
