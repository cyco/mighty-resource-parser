import { ShapeSheet, Shape, ShapeSet } from '../models';
import { Stream, InputStream } from 'src/util';
import { Resource } from '../resource';

const determinePaletteSourceForShapes = (path: string) => {
  switch (path) {
    case 'Shapes/OverheadMap.shapes':
      return 'Images/OverheadMap.image';
    case 'Shapes/title.shapes':
      return 'Images/titlepage.image';
    case 'Shapes/view.shapes':
      return 'Images/ViewPPC.image';
      return 'Images/Head.image';
    default:
      return 'Images/Border.image';
  }
};

const parseShape = (input: InputStream, base: number): Shape => {
  const shape = new Shape();
  shape.width = input.getUint16();
  shape.height = input.getUint16();
  shape.anchorX = input.getInt16();
  shape.anchorY = input.getInt16();

  const pixelShift = input.getInt16();
  const relativePixelOffset = input.getInt16();
  const pixelOffset =
    base + relativePixelOffset + (relativePixelOffset < 0 ? (pixelShift + 1) << 16 : pixelShift << 16);
  const maskShift = input.getInt16();
  const relativeMaskOffset = input.getInt16();
  const maskOffset = base + relativeMaskOffset + (relativeMaskOffset < 0 ? (maskShift + 1) << 16 : maskShift << 16);
  const offset = input.offset;
  const size = shape.width * shape.height;
  input.seek(pixelOffset, Stream.Seek.Set);
  shape.pixels = input.getUint8Array(size);
  if (maskShift != 0) {
    input.seek(maskOffset, Stream.Seek.Set);
    shape.mask = input.getUint8Array(size);
  } else {
    shape.mask = new Uint8Array(size);
  }
  input.seek(offset, Stream.Seek.Set);
  return shape;
};

const parseShapeSet = (input: InputStream) => {
  const offset = input.offset;

  const shapeSheet = new ShapeSet();
  shapeSheet.unknown1 = input.getUint8();
  shapeSheet.unknown2 = input.getUint8();
  shapeSheet.ten = input.getUint32();
  shapeSheet.unknown3 = input.getUint32();

  const shapeCount = input.getUint16();
  input.seek(offset - shapeCount * 16, Stream.Seek.Set);
  shapeSheet.shapes = [];
  for (let i = 0; i < shapeCount; i++) {
    shapeSheet.shapes.push(parseShape(input, offset));
  }

  return shapeSheet;
};

export default (resource: Resource, input: InputStream) => {
  const unpackedSize = input.getUint32();
  const unpackedType = input.getUint32();
  const setCount = input.getUint16();
  const offsets = [];
  for (let i = 0; i < setCount; i++) {
    offsets.push(input.getUint32());
  }

  const sets = [];
  for (const offset of offsets) {
    input.seek(offset, Stream.Seek.Set);
    sets.push(parseShapeSet(input));
  }
  const result = new ShapeSheet();
  result.sets = sets;
  result.paletteSource = determinePaletteSourceForShapes(resource.path);
  return result;
};
