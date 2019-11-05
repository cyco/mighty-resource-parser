import { Component, Input } from "@angular/core";
import { Resource } from "src/mighty-data/resource";
import { ResourceManager } from "src/mighty-data/resource-manager";
import { Parser } from "src/mighty-data/parser/parser";
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

  private _resource: Resource;
  public content: any;
  public parser: Parser = new Parser();

  @Input()
  public set resource(r) {
    this._resource = r;
    this.content = this.parser.parse(this._resource, this.resourceManager);
  }

  public get resource() {
    return this._resource;
  }
}
