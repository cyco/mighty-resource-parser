export class Resource {
  public readonly path: string;
  public readonly data: ArrayBuffer;
  public readonly type: any = null;
  public contents: any;

  constructor(path: string, data: ArrayBuffer, type: any) {
    this.path = path;
    this.data = data;
    this.type = type;
  }
}
