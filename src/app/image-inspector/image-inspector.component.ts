import { Component, Input } from '@angular/core';
import { Image } from 'src/mighty-data/models/image';

@Component({
  selector: 'app-image-inspector',
  templateUrl: './image-inspector.component.html',
  styleUrls: ['./image-inspector.component.scss']
})
export class ImageInspectorComponent {
  @Input()
  public image: Image;
}
