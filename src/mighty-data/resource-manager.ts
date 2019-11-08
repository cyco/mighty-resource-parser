import { Resource } from "./resource";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { TypeDetector } from "./type-detector";
import { SoundSheet } from "./models";
import { Parser } from "./parser";

@Injectable({ providedIn: "root" })
export class ResourceManager {
  private cache: Map<string, any> = new Map();

  constructor(
    private httpClient: HttpClient,
    private typeDetector: TypeDetector,
    private parser: Parser
  ) {}

  get(path: string): Observable<any> {
    if (this.cache.has(path)) {
      return of(this.cache.get(path));
    }

    const type = this.typeDetector.detect(path);
    const url = [
      "assets",
      "Data",
      path + (type === SoundSheet ? "@rsrc-fork" : "")
    ].join("/");

    return this.httpClient.get(url, { responseType: "arraybuffer" }).pipe(
      map(c => new Resource(path, c, type)),
      map(r => this.parser.parse(r, this)),
      map(resource => (this.cache.set(path, resource), resource))
    );
  }
}
