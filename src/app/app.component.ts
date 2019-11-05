import { Component, NgZone } from "@angular/core";
import { Resource } from "src/mighty-data/resource";
import { Subscription } from "rxjs";
import { ResourceManager } from "src/mighty-data/resource-manager";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "viewer";
  public loading: Subscription = null;
  public resource: Resource = null;
  public error: string = null;

  constructor(private resourceManager: ResourceManager, private zone: NgZone) {}

  public selectResource(path: string) {
    if (this.loading) this.loading.unsubscribe();
    this.error = null;

    this.loading = this.resourceManager.get(path).subscribe(
      this.runHack(resource => {
        if (this.loading) this.loading.unsubscribe();

        this.loading = null;
        this.resource = resource;
      }),
      error => {
        if (this.loading) this.loading.unsubscribe();
        this.loading = null;
        this.error = error.statusText;
      }
    );
  }

  private runHack(cb: (...args: any[]) => void): () => void {
    return (...args: any[]) => this.zone.run(() => setTimeout(cb, 0, ...args));
  }
}
