import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { Upgrade } from '../upgrade';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent implements OnInit, OnChanges {
  @Input() upgrade: Upgrade;
  @Input() money: number;

  @Output() upgradeReturn = new EventEmitter<[number, Upgrade]>();

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    let upgradeDiv = document.getElementById(this.upgrade.name).getElementsByClassName('upgrade') as HTMLCollectionOf<HTMLElement>;
    if (this.upgrade.quantity[0] !== this.upgrade.quantity[1]) {
      if (this.money < this.upgrade.cost) {
        upgradeDiv[0].style.backgroundColor = "rgba(255,100,100,0.5)";
      } else {
        upgradeDiv[0].style.backgroundColor = "rgba(100,255,100,0.5)";
      }
    } else {
      upgradeDiv[0].style.backgroundColor = "rgba(50,255,255,0.5)";
    }
  }

  purchase(max: boolean) {
    let newMoney = this.upgrade.buyUpgrade(this.money, max);
    if (newMoney != undefined) {
      this.upgradeReturn.emit([newMoney, this.upgrade]);
    }
  }

}
