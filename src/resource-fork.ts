import { InputStream, Stream } from 'src/util';

type Header = {
  headerMapOffset: number;
  mapLength: number;
  dataOffset: number;
  dataLength: number;
};
type Type = {
  resources: Resource[];
  type: number;
  lastResourceIndex: number;
  resourceOffset: number;
};
type Map = {
  reserved: Uint8Array;
  types: Type[];
  nextHandle: number;
  fileReference: number;
  attributes: number;
};
type Resource = {
  data: Uint8Array;
  id: number;
  nameOffset: number;
  attributes: number;
  dataOffset: number;
  reservedHandle: number;
  name: string;
};

export class ResourceFork {
  private header: Header;
  private map: Map;

  constructor(stream: InputStream) {
    [this.header, this.map] = this.read(stream);
  }

  private read(stream: InputStream): [Header, Map] {
    const header = this.readHeader(stream);
    const map = this.readHeaderMap(
      stream,
      header.headerMapOffset,
      header.mapLength
    );

    for (const type of map.types) {
      for (const resource of type.resources) {
        stream.seek(header.dataOffset + resource.dataOffset, Stream.Seek.Set);
        const length = stream.getUint32();
        resource.data = stream.getUint8Array(length);
      }
    }

    return [header, map];
  }

  private readHeader(stream: InputStream): Header {
    const dataOffset = stream.getUint32();
    const headerMapOffset = stream.getUint32();
    const dataLength = stream.getUint32();
    const mapLength = stream.getUint32();

    return { dataOffset, headerMapOffset, dataLength, mapLength };
  }

  private readHeaderMap(
    stream: InputStream,
    offset: number,
    _len: number
  ): Map {
    stream.seek(offset, Stream.Seek.Set);
    const reserved = stream.getUint8Array(0x10);

    const nextHandle = stream.getUint32();
    const fileReference = stream.getUint16();
    const attributes = stream.getUint16();
    const typeOffset = stream.getUint16();
    const nameOffset = stream.getUint16();
    const lastTypeIndex = stream.getUint16();

    stream.seek(offset + typeOffset + 2, Stream.Seek.Set);

    const types = [];
    for (let i = 0; i < lastTypeIndex + 1; i++) {
      types.push(this.readResourceForkType(stream));
    }

    for (const type of types) {
      const references = [];
      for (let i = 0; i <= type.lastResourceIndex; i++) {
        references.push(this.readResource(stream));
      }
      type.resources = references;
    }

    for (const type of types) {
      for (const resource of type.resources) {
        if (resource.nameOffset === -1 || resource.nameOffset === 0xffff) {
          continue;
        }

        stream.seek(offset + resource.nameOffset + nameOffset, Stream.Seek.Set);
        resource.name = stream.getPascalString();
      }
    }

    return { reserved, nextHandle, fileReference, attributes, types };
  }

  private readResourceForkType(stream: InputStream): Type {
    const type = stream.getUint32();
    const lastResourceIndex = stream.getUint16();
    const resourceOffset = stream.getUint16();

    return { type, lastResourceIndex, resourceOffset, resources: [] };
  }

  private readResource(stream: InputStream): Resource {
    const id = stream.getUint16();
    const nameOffset = stream.getUint16();
    const attributes = stream.getUint8();
    const dataOffset = stream.getUint24();
    const reservedHandle = stream.getUint32();

    return {
      id,
      nameOffset,
      attributes,
      dataOffset,
      reservedHandle,
      name: '',
      data: null
    };
  }

  public list(typeIdentifier: string) {
    const type = this.map.types.find(
      t => t.type === this.convertToTypeTag(typeIdentifier)
    );

    if (!type) { return []; }

    return type.resources.map(r => ({ id: r.id, name: r.name }));
  }

  public readResourceData(typeIdentifier: string, id: number) {
    const resource = this.map.types
      .find(t => t.type === this.convertToTypeTag(typeIdentifier))
      .resources.find(r => r.id === id);
    if (!resource) { return null; }

    return resource.data;
  }

  private convertToTypeTag(type: string) {
    return (
      (type.charCodeAt(0) << 24) +
      (type.charCodeAt(1) << 16) +
      (type.charCodeAt(2) << 8) +
      (type.charCodeAt(3) << 0)
    );
  }

  private convertTagToString(tag: number) {
    return String.fromCharCode(
      (tag & 0xff000000) >> 24,
      (tag & 0xff0000) >> 16,
      (tag & 0xff00) >> 8,
      (tag & 0xff) >> 0
    );
  }
}
