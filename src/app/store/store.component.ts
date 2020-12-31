import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Upgrade } from './upgrade';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  @Input() upgradeDict: {[id:string] : Upgrade};
  @Input() money: number;

  @Output() upgradeReturn = new EventEmitter<[number, Upgrade]>();

  constructor() { }

  ngOnInit() { }

  emitUpgradeReturn(value: [number, Upgrade]) {
    this.upgradeReturn.emit(value);
  }
  

}
