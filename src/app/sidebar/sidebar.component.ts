import { Component, Output, EventEmitter } from '@angular/core';
import { faFolder } from '@fortawesome/free-regular-svg-icons';

type Directory = { name: string; icon: any; files: string[] };

const sort = (dir: Directory[]) =>
  dir.map(({ name, icon, files }) => ({
    name,
    icon,
    files: files.sort((a, b) => a.localeCompare(b))
  }));

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() selectResource = new EventEmitter<string>();

  public directories: Directory[] = sort([
    {
      name: 'Audio',
      icon: faFolder,
      files: [
        'Bargain.sounds',
        'Clown.sounds',
        'General.sounds',
        'Music',
        'Candy.sounds',
        'Fairy.sounds',
        'Jurassic.sounds',
        'Weapon.sounds'
      ]
    },
    {
      name: 'Images',
      icon: faFolder,
      files: [
        'BargainScene.image',
        'Bonus.image',
        'Border.image',
        'CandyScene.image',
        'Charging.image',
        'ClownScene.image',
        'Credits1.image',
        'Diff.image',
        'DinoScene.image',
        'FairyScene.image',
        'Head.image',
        'Lose.image',
        'OverheadMap.image',
        'OverheadMap2.image',
        'OverheadMap3.image',
        'PlayerChoose.image',
        'RadarMap.image',
        'Scores.image',
        'View68K.image',
        'ViewPPC.image',
        'Win.image',
        'border2.image',
        'legal.image',
        'register.image',
        'titlepage.image',
        'winbw.image'
      ]
    },
    {
      name: 'Maps',
      icon: faFolder,
      files: [
        'Bargain.Tileset',
        'Bargain.map-1',
        'Bargain.map-2',
        'Bargain.map-3',
        'Candy.Map-1',
        'Candy.Map-2',
        'Candy.map-3',
        'Candy.tileset',
        'Clown.Map-1',
        'Clown.tileset',
        'Fairy.Map-1',
        'Fairy.Tileset',
        'Fairy.map-2',
        'Fairy.map-3',
        'Jurassic.map-1',
        'Jurassic.map-2',
        'Jurassic.map-3',
        'Jurassic.tileset',
        'clown.map-2',
        'clown.map-3'
      ]
    },
    { name: 'Movies', icon: faFolder, files: ['Pangea.spin'] },
    {
      name: 'Shapes',
      icon: faFolder,
      files: [
        'Bonus.shapes',
        'Difficulty.shapes',
        'OverheadMap.shapes',
        'Win.shapes',
        'bargain1.shapes',
        'bargain2.shapes',
        'candy1.shapes',
        'candy2.shapes',
        'clown1.shapes',
        'clown2.shapes',
        'fairy1.shapes',
        'fairy2.shapes',
        'highscore.shapes',
        'infobar.shapes',
        'infobar2.shapes',
        'jurassic1.shapes',
        'jurassic2.shapes',
        'main.shapes',
        'playerchoose.shapes',
        'title.shapes',
        'view.shapes',
        'weapon.shapes'
      ]
    }
  ]);
  public currentDir: Directory = null;
  public currentFile: string = null;

  select(file: string, dir: Directory) {
    this.currentDir = dir;
    this.currentFile = file;

    this.selectResource.emit([dir.name, file].join('/'));
  }
}
