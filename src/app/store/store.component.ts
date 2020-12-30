import { Component, Input, OnInit } from '@angular/core';
import { Upgrade } from './upgrade';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  @Input() upgradeList: Upgrade[];

  constructor() { }

  ngOnInit() { }


}
