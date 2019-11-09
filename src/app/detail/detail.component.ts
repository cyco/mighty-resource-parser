import { Component, Input } from "@angular/core";
import { ResourceManager } from "src/mighty-data/resource-manager";
import * as Models from "src/mighty-data/models";
import { faFile } from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"]
})
export class DetailComponent {
  public Models = Models;
  @Input()
  public resourceManager: ResourceManager;
  @Input()
  public resource: any;
  public fileIcon: any = faFile;
}
