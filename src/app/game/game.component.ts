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
  private displayStore = false;
  upgradeList: Upgrade[] = [];

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
      let money = 0;
  
      p5.setup = () => {
        p5.frameRate(frame_rate);
        let canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight).parent('game-canvas');
        canvas.position(0, 0);
        canvas.style('z-index', '-1');
      };
  
      p5.draw = () => {
        p5.background(75);
        grains.forEach(function (grain) {
          grain.show(p5);
          grain.update(grainWeight, grainRarity);
      
          // remove if grain goes off window
          // height is doubled so that dust particles wont disappear too early
          if (grain.y >= p5.windowHeight*2 || (grain.x >= p5.windowWidth || grain.x <= 0)){
              // grains.splice(index, 1);
          }
      
          // sifting if mouse is in range of sand particle
          if (p5.mouseX >= Math.abs(grain.x - siftRange) && p5.mouseX <= (grain.x + siftRange)) {
              if (p5.mouseY >= grain.y && p5.mouseY <= (grain.y + 10)) {
                  if (!grain.sifted) {
                      money += grain.sift(siftEfficiency);
                      // document.getElementById("currentMoney").innerHTML = "$" + String(money.toFixed(2));
                  }
              }
          }
        });
    
        // create new grain as a factor of framerate
        let sandRate = Number(frame_rate - grainFrequency); // how many frames per grain (decreases with grainFrequency)
        if (sandRate <= 1) {
            sandRate = 1;
        }
        if (p5.frameCount % sandRate == 0) {
            grains.push(new Sand(Math.random()*p5.width, 0, 2, grainWeight, grainRarity));
        }
      };
    };

    this.p5 = new p5(sketch);
  }

  private createUpgrades = () => {
    console.log('creating upgrades');
    this.upgradeList.push({name: 'Sift Range',       cost: 0.25,  increaseCost: 2,     value: 5,     increaseValue: 5     } as Upgrade);
    this.upgradeList.push({name: 'Sift Efficiency',  cost: 0.1,   increaseCost: 1.25,  value: 0.1,   increaseValue: 0.1   } as Upgrade);
    this.upgradeList.push({name: 'Grain Weight',     cost: 1.25,  increaseCost: 1.5,   value: 1,     increaseValue: 0.5   } as Upgrade);
    this.upgradeList.push({name: 'Grain Rarity',     cost: 5,     increaseCost: 5,     value: 0.01,  increaseValue: 0.01  } as Upgrade);
    this.upgradeList.push({name: 'Grain Frequency',  cost: 0.5,   increaseCost: 1.75,  value: 0,     increaseValue: 1     } as Upgrade);
  }

  clickStore() {
    this.displayStore = !this.displayStore;
  }

}
