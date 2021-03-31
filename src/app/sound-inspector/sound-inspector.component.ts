import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import * as WaveSurfer from 'wavesurfer.js';
import { sndToWav, download } from 'src/util';

@Component({
  selector: 'app-sound-inspector',
  templateUrl: './sound-inspector.component.html',
  styleUrls: ['./sound-inspector.component.scss'],
  host: { tabIndex: '0', '(keydown.space)': 'togglePlayback()' }
})
export class SoundInspectorComponent implements AfterViewInit, OnDestroy {
  @Input()
  public soundName: string;
  @Input()
  public soundId: number;
  public error: string;
  public _soundData: any;
  @ViewChild('waveform')
  waveform: ElementRef<HTMLDivElement>;
  private wavesurfer: WaveSurfer;
  private _sound: Blob | File;

  ngAfterViewInit(): void {
    const ctx = document.createElement('canvas').getContext('2d');
    const linGrad = ctx.createLinearGradient(0, 64, 0, 200);
    linGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.000)');
    linGrad.addColorStop(0.5, 'rgba(183, 183, 183, 1.000)');

    this.wavesurfer = WaveSurfer.create({
      container: this.waveform.nativeElement,
      waveColor: linGrad as any,
      progressColor: 'hsla(200, 100%, 30%, 0.5)',
      cursorColor: '#fff',
      barWidth: 3
    });

    this.reloadSound();
  }

  ngOnDestroy() {
    if (!this.wavesurfer) { return; }
    this.wavesurfer.stop();
    this.wavesurfer.destroy();
    this.wavesurfer = null;
  }

  @Input()
  public set soundData(d: any) {
    this._soundData = d;
    try {
      const wav = d ? sndToWav(d) : null;
      this.error = null;
      this._sound = new Blob([new DataView(wav)], { type: 'audio/wav' });
    } catch (e) {
      this.error = e;
      this._sound = null;
    }

    this.reloadSound();
  }

  public get soundData() {
    return this._soundData;
  }

  public togglePlayback() {
    if (!this.wavesurfer) { return; }
    this.wavesurfer.playPause();
  }

  private reloadSound() {
    if (!this.wavesurfer) { return; }

    if (this._sound) { this.wavesurfer.loadBlob(this._sound); }
    else { this.wavesurfer.empty(); }
  }

  public downloadSndFile() {
    download(this._soundData, `${this.soundName}.snd`);
  }

  public downloadWavFile() {
    download(sndToWav(this._soundData), 'sound.wav');
  }
}
