import { Component, Input } from "@angular/core";
import { ResourceManager } from "src/mighty-data/resource-manager";
import * as Models from "src/mighty-data/models";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"]
})
export class DetailComponent {
  public Models = Models;
  @Input()
  public resourceManager: ResourceManager;

  private _resource: any;
  public content: any;

  @Input()
  public set resource(r) {
    this._resource = { type: r.constructor };
    this.content = r;
  }

  public get resource() {
    return this._resource;
  }
}
