export class Resource {
  public readonly path: string;
  public readonly contents: ArrayBuffer;
  public readonly type: any;

  constructor(path: string, contents: ArrayBuffer, type: any) {
    this.path = path;
    this.contents = contents;
    this.type = type;
  }
}
