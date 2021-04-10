import { Component, Input } from '@angular/core';
import { ResourceManager } from 'src/mighty-data/resource-manager';
import * as Models from 'src/mighty-data/models';
import { faFile, faSave } from '@fortawesome/free-regular-svg-icons';
import { SerializerService } from 'src/app/serializer.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  public Models = Models;
  @Input()
  public resourceManager: ResourceManager;
  @Input()
  public resource: any;
  public fileIcon: any = faFile;
  public saveIcon: any = faSave;

  constructor(private serializer: SerializerService) {}

  download() {
    this.serializer.download(this.resource);
  }

  public get canDownload(): boolean {
    return this.serializer.canSerialize(this.resource);
  }
}
