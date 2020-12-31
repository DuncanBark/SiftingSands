import { Component, Input, OnInit} from '@angular/core';
import { Upgrade } from './upgrade';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  @Input() upgradeDict: {[id:string] : Upgrade};
  @Input() money: number;

  constructor() { }

  ngOnInit() {
    // let upgradeDiv = document.getElementsByClassName('upgrade-list') as HTMLCollectionOf<HTMLElement>;
    // let liList = upgradeDiv[0].getElementsByTagName("li") as HTMLCollectionOf<HTMLElement>;
    // console.log(upgradeDiv[0]);
    // console.log(liList);
  }
  

}
