import { Component, OnInit, ɵɵstylePropInterpolate4 } from '@angular/core';
import { Sand } from './sand';
import { Upgrade } from '../store/upgrade';
import { Option } from '../options/option';
import { draw_sifter, create_grain, update_grain, mouse_clicked, check_cursor, required_drawing } from './utils';
import * as p5 from 'p5';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  private p5;
  money: number = 10000000;
  displayStore: boolean = false;
  displayOptions: boolean = false;
  upgradeDict: {[id:string] : Upgrade; } = {};
  optionDict: {[id:string] : Option; } = {};
  start_sand: boolean = false;

  constructor() {
    console.log('Main app constructed');
  }

  ngOnInit() {
    console.log('Main init');
    this.createUpgrades();
    this.createOptions();
    this.createCanvas();
  }

  private createCanvas = () => {
    console.log('creating canvas');
    const sketch = p5 => {
      // p5.disableFriendlyErrors = true;
      let grains: Sand[] = [];
      let frame_rate = 60;
      let offScreen = true;
      let holdSift = true;
      let siftX = p5.windowWidth/2;
      let siftY =  p5.windowHeight/2;
      let stableFrameRate = 0;
      let curRange, curEfficiency, curWeight, curRarity, curFrequency;
      let cursor = "grab"
      let css_cursor = document.getElementsByClassName('game-canvas') as HTMLCollectionOf<HTMLElement>;
  
      p5.setup = () => {
        p5.frameRate(frame_rate);
        let canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight).parent('game-canvas');
        canvas.position(0, 0);
        canvas.style('z-index', '-1');

        // if mouse moves off screen or on screen, update offScreen
        // this controls sifting, since mouseX and mouseY dont change if you move off screen
        canvas.mouseOut(() => {offScreen = true});
        canvas.mouseOver(() => {offScreen = false});
      };
  
      p5.draw = () => {
        required_drawing(css_cursor, cursor, p5, this.optionDict);
        
        // Misc framerate text
        if (p5.frameCount % frame_rate === 0) {
            stableFrameRate = p5.frameRate();
        }
        p5.text(`requestedFPS = ${frame_rate}`, 200, 20);
        p5.text(`realFPS = ${p5.round(stableFrameRate)}`, 200, 40);
  

        // get current upgrade values
        curRange = this.upgradeDict["Sift Range"].value;
        curEfficiency = this.upgradeDict["Sift Efficiency"].value;
        curWeight = this.upgradeDict["Grain Weight"].value;
        curRarity = this.upgradeDict["Grain Rarity"].value;
        curFrequency = this.upgradeDict["Grain Frequency"].value;

        
        // Sifter and Cursor logic ====================================================================================================================================================================
        draw_sifter(p5, offScreen, holdSift, this.optionDict, siftX, curRange, siftY);

        cursor = check_cursor(p5, siftX, curRange, siftY, offScreen, cursor, false);

        p5.mouseClicked = () => {
          [this.start_sand, cursor, siftX, siftY, holdSift] = mouse_clicked(p5, siftX, curRange, siftY, offScreen, cursor, this.start_sand, holdSift);
        }

        if (!holdSift) {
          siftX = p5.mouseX;
          siftY = p5.mouseY;
        }
        // ============================================================================================================================================================================================


        // Grain logic ================================================================================================================================================================================
        // create new grain as a factor of framerate
        create_grain(p5, curFrequency, grains, curWeight, curRarity, Sand, this.upgradeDict, this.optionDict, this.start_sand);

        let money = this.money;
        grains.forEach(function (item, index) {
          let removeGrain = false;
          [removeGrain, money] = update_grain(p5, item, offScreen, holdSift, siftX, curRange, siftY, money, curEfficiency);
          if (removeGrain) {
            grains.splice(index, 1);
          }
        });
        this.money = money;
        // ============================================================================================================================================================================================
      };
    };

    this.p5 = new p5(sketch);
  }

  private createUpgrades = () => {
    console.log('creating upgrades');
    //                                    new Upgrade(name,                cost,   increaseCost,  value,  increaseValue,  quantity,  tooltip)
    this.upgradeDict["Sift Range"]      = new Upgrade('Sift Range',        0.25,   2,             25,     5,              [0, 20],   "Be further away from grains to sift them");
    this.upgradeDict["Sift Efficiency"] = new Upgrade('Sift Efficiency',   0.1,    2,             1,      0.05,           [0, 20],   "Allows you to sift more reliably");
    this.upgradeDict["Grain Weight"]    = new Upgrade('Grain Weight',      1.25,   1.5,           2,      0.5,            [0, 10],   "Grains fall quicker");
    this.upgradeDict["Grain Rarity"]    = new Upgrade('Grain Rarity',      5,      5,             0.01,   0.01,           [0, 5],    "Get more money from each successful sift");
    this.upgradeDict["Grain Frequency"] = new Upgrade('Grain Frequency',   0.5,    1.1,           0,      1,              [0, 60],   "More grains? What's going on?");
  }

  updateUpgrade(value: [number, Upgrade]) {
    this.money = value[0];
    this.upgradeDict[value[1].name] = value[1];
  }

  clickStore() {
    this.displayStore = !this.displayStore;
    this.displayOptions = false;
  }

  private createOptions = () => {
    console.log('creating options');
    //                                          new Option(name,               value)
    this.optionDict["Background color (Red)"] = new Option('Background color (Red)', 50);
    this.optionDict["Background color (Green)"] = new Option('Background color (Green)', 50);
    this.optionDict["Background color (Blue)"] = new Option('Background color (Blue)', 50);
    this.optionDict["Sand color (Red)"] = new Option('Sand color (Red)', 180);
    this.optionDict["Sand color (Green)"] = new Option('Sand color (Green)', 180);
    this.optionDict["Sand color (Blue)"] = new Option('Sand color (Blue)', 0);
    this.optionDict["Sifter color (Red)"] = new Option('Sifter color (Red)', 0);
    this.optionDict["Sifter color (Green)"] = new Option('Sifter color (Green)', 0);
    this.optionDict["Sifter color (Blue)"] = new Option('Sifter color (Blue)', 0);
  }

  updateOption(value) {
    this.optionDict = value;
  }

  clickOptions() {
    this.displayStore = false;
    this.displayOptions = !this.displayOptions;
  }

}
