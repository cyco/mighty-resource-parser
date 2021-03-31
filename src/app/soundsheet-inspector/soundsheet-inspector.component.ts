import { Component, Input } from '@angular/core';
import { SoundSheet } from 'src/mighty-data/models/sound-sheet';

@Component({
  selector: 'app-soundsheet-inspector',
  templateUrl: './soundsheet-inspector.component.html',
  styleUrls: ['./soundsheet-inspector.component.scss']
})
export class SoundsheetInspectorComponent {
  @Input()
  public soundsheet: SoundSheet;
  public currentSound: { id: number; name: string };
  public currentSoundData: ArrayBuffer;

  selectSound(sound: { id: number; name: string }) {
    this.currentSound = sound;
    this.currentSoundData = this.soundsheet.loadSound(sound.id);
  }
}
