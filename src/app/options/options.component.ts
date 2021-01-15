import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Option } from './option';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  @Input() optionDict: {[id:string] : Option};
  @Input() money: number;

  @Output() optionReturn = new EventEmitter<{[id:string] : Option}>();

  constructor() { }

  ngOnInit(): void {
  }

  setOption(name, value) {
    this.optionDict[name].value = value;
    this.optionReturn.emit(this.optionDict);
  }

}
