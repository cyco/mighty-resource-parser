import { ResourceFork } from 'src/resource-fork';

export class SoundSheet {
  private _sounds: { id: number; name: string }[];
  private _soundData = new Map<number, any>();

  constructor(private resourceFork: ResourceFork) {}

  get sounds() {
    return this._sounds || (this._sounds = this.resourceFork.list('snd '));
  }

  public loadSound(id: number) {
    if (this._soundData.has(id)) { return this._soundData.get(id); }
    const soundData = this.resourceFork.readResourceData('snd ', id);
    this._soundData.set(id, soundData);
    return soundData;
  }
}
