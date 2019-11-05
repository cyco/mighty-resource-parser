export class Image {
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly pixels: Uint8Array,
    public readonly palette: Uint32Array
  ) {}
}
