import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Upgrade } from '../upgrade';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent implements OnInit, OnChanges {
  @Input() upgrade: Upgrade;
  @Input() afford: boolean;

  color: string;

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    let upgradeDiv = document.getElementById(this.upgrade.name).getElementsByClassName('upgrade') as HTMLCollectionOf<HTMLElement>;
    if (!this.afford) {
      this.color = "rgba(255,100,100,0.5)"
      upgradeDiv[0].style.backgroundColor = this.color;
    } else {
      this.color = "rgba(100,255,100,0.5)";
      upgradeDiv[0].style.backgroundColor = this.color;
    }
  }

}
