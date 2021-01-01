import { Component, OnInit } from '@angular/core';
import { Sand } from './sand';
import { Upgrade } from '../store/upgrade';
import * as p5 from 'p5';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  private p5;
  money: number = 10000000;
  displayStore: boolean = true;
  upgradeDict: {[id:string] : Upgrade; } = {};

  constructor() {
    console.log('Main app constructed');
  }

  ngOnInit() {
    console.log('Main init');
    this.createUpgrades();
    this.createCanvas();
  }

  private createCanvas = () => {
    console.log('creating canvas');
    const sketch = p5 => {
      let grains: Sand[] = [];
      let frame_rate = 60;
      let offScreen = true;
      let holdSift = false;
      let siftX: number;
      let siftY: number;
      let stableFrameRate = 0;
  
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
        p5.clear();
        p5.background(75);

        if (!holdSift) {
          siftX = p5.mouseX;
          siftY = p5.mouseY;
        }

        // get current upgrade values
        let curRange = this.upgradeDict["Sift Range"].value;
        let curEfficiency = this.upgradeDict["Sift Efficiency"].value;
        let curWeight = this.upgradeDict["Grain Weight"].value;
        let curRarity = this.upgradeDict["Grain Rarity"].value;
        let curFrequency = this.upgradeDict["Grain Frequency"].value
        let money = this.money;

        grains.forEach(function (item, index) {
          let removeGrain = updateGrain(item);
          if (removeGrain == true) {
            grains.splice(index, 1);
          }
        });

        if (p5.frameCount % frame_rate === 0) {
          stableFrameRate = p5.frameRate();
      }

        p5.text(`requestedFPS = ${frame_rate}`, 200, 20);
        p5.text(`realFPS = ${p5.round(stableFrameRate)}`, 200, 40);
    
        this.money = money;

        // create new grain as a factor of framerate
        let grainWidth = 2 + (this.upgradeDict["Grain Weight"].quantity[0] / 8);
        if (p5.frameCount % 60 == 0) {
          for (let i = 0; i <= Math.abs(curFrequency); i++) {
            grains.push(new Sand(Math.random()*p5.width, Math.random()*-300, grainWidth, curWeight, curRarity));
          }
        }

        function updateGrain(grain) {
          grain.show(p5);
          grain.update();
          let removeGrain = true;
          let gX = grain.x;
          let gY = grain.y;
          let wH = p5.windowHeight;
          let wW = p5.windowWidth;
      
          // if the grain itself goes off the window, check its dustPaticles (if any) and only remove
          // the grain if all dust particles have gone off the window
          if (gY >= wH || (gX >= wW || gX <= 0)){
            removeGrain = removeGrain && true;
            for (let i = 0; i < grain.dustParticles.length; i++) {
              if (grain.dustParticles[i].y >= wH || (grain.dustParticles[i].x >= wW || grain.dustParticles[i].x <= 0)){
                removeGrain = removeGrain && true;
              } else {
                removeGrain = removeGrain && false;
              }
            }
          } else {
            removeGrain = removeGrain && false;
          }

          // sifting if mouse is in range of sand particle and the mouse is on screen
          if (!offScreen || holdSift) {
            p5.stroke(p5.color(100, 200, 100));
            p5.line(siftX-curRange, siftY, siftX+curRange, siftY);
            if (siftX >= gX - curRange && siftX <= (gX + curRange)) {
                if (siftY >= (gY - 25) && siftY <= (gY + 5)) {
                    if (!grain.sifted) {
                        money += grain.sift(curEfficiency);
                    }
                }
            }
          }

          return removeGrain;
        }

        p5.mouseClicked = () => {
          if (!offScreen) {
            holdSift = !holdSift;
            siftX = p5.mouseX;
            siftY = p5.mouseY;
          }
        }

      };
    };

    this.p5 = new p5(sketch);
  }

  private createUpgrades = () => {
    console.log('creating upgrades');
    //                                   new Upgrade(name,                cost,   increaseCost,  value,  increaseValue,  quantity,  tooltip)
    this.upgradeDict["Sift Range"]      = new Upgrade('Sift Range',        0.25,   2,             50,     5,              [0, 20],   "Be further away from grains to sift them");
    this.upgradeDict["Sift Efficiency"] = new Upgrade('Sift Efficiency',   0.1,    2,             1,      0.05,           [0, 20],   "Allows you to sift more reliably");
    this.upgradeDict["Grain Weight"]    = new Upgrade('Grain Weight',      1.25,   1.5,           1,      0.5,            [0, 10],   "Grains fall quicker");
    this.upgradeDict["Grain Rarity"]    = new Upgrade('Grain Rarity',      5,      5,             0.01,   0.01,           [0, 5],    "Get more money from each successful sift");
    this.upgradeDict["Grain Frequency"] = new Upgrade('Grain Frequency',   0.5,    1.1,           0,      1,              [0, 60],   "More grains? What's going on?");
  }

  clickStore() {
    this.displayStore = !this.displayStore;
  }

  updateUpgrade(value: [number, Upgrade]) {
    this.money = value[0];
    this.upgradeDict[value[1].name] = value[1];
  }

}
