import { Resource } from "./resource";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { TypeDetector } from "./type-detector";
import { SoundSheet } from "./models";

@Injectable({ providedIn: "root" })
export class ResourceManager {
  private cache: Map<string, Resource> = new Map();
  private typeDetector = new TypeDetector();

  constructor(private httpClient: HttpClient) {}

  get(path: string): Observable<Resource> {
    if (this.cache.has(path)) {
      return of(this.cache.get(path));
    }

    const type = this.typeDetector.detect(path);
    return this.httpClient
      .get(
        [
          "assets",
          "Data",
          path + (type === SoundSheet ? "@rsrc-fork" : "")
        ].join("/"),
        { responseType: "arraybuffer" }
      )
      .pipe(
        map(c => new Resource(path, c, type)),
        map(resource => (this.cache.set(path, resource), resource))
      );
  }
}
