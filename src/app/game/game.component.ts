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
  money: number = 0;
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
        p5.background(75);

        // get current upgrade values
        let curRange = this.upgradeDict["siftRange"].value;
        let curEfficiency = this.upgradeDict["siftEfficiency"].value;
        let curWeight = this.upgradeDict["grainWeight"].value;
        let curRarity = this.upgradeDict["grainRarity"].value;
        let curFrequency = this.upgradeDict["grainFrequency"].value
        let money = this.money;

        grains.forEach(function (item, index) {
          let removeGrain = updateGrain(item);
          if (removeGrain == true) {
            grains.splice(index, 1);
          }
        });
    
        this.money = money;

        // create new grain as a factor of framerate
        let sandRate = Number(frame_rate - curFrequency); // how many frames per grain (decreases with grainFrequency)
        if (sandRate <= 1) {
            sandRate = 1;
        }
        if (p5.frameCount % sandRate == 0) {
            grains.push(new Sand(Math.random()*p5.width, 0, 2, curWeight, curRarity));
        }

        function updateGrain(grain) {
          grain.show(p5);
          grain.update(curWeight, curRarity);
          let removeGrain = true;
      
          // if the grain itself goes off the window, check its dustPaticles (if any) and only remove
          // the grain if all dust particles have gone off the window
          if (grain.y >= p5.windowHeight || (grain.x >= p5.windowWidth || grain.x <= 0)){
            removeGrain = removeGrain && true;
            for (let i = 0; i < grain.dustParticles.length; i++) {
              if (grain.dustParticles[i].y >= p5.windowHeight || (grain.dustParticles[i].x >= p5.windowWidth || grain.dustParticles[i].x <= 0)){
                removeGrain = removeGrain && true;
              } else {
                removeGrain = removeGrain && false;
              }
            }
          } else {
            removeGrain = removeGrain && false;
          }

          // sifting if mouse is in range of sand particle and the mouse is on screen
          if (!offScreen) {
            if (p5.mouseX >= grain.x - curRange && p5.mouseX <= (grain.x + curRange)) {
                if (p5.mouseY >= grain.y && p5.mouseY <= (grain.y + 10)) {
                    if (!grain.sifted) {
                        money += grain.sift(curEfficiency);
                    }
                }
            }
          }

          return removeGrain;
        }

      };
    };

    this.p5 = new p5(sketch);
  }

  private createUpgrades = () => {
    console.log('creating upgrades');

    this.upgradeDict["siftRange"]      = {name: 'Sift Range (0/20)',       cost: 0.25,  increaseCost: 2,    value: 50,    increaseValue: 5,     tooltip: "Be further away from grains to sift them"  } as Upgrade;
    this.upgradeDict["siftEfficiency"] = {name: 'Sift Efficiency (0/20)',  cost: 0.1,   increaseCost: 2,    value: 1,     increaseValue: 0.05,  tooltip: "Allows you to sift more reliably"  } as Upgrade;
    this.upgradeDict["grainWeight"]    = {name: 'Grain Weight (0/10)',     cost: 1.25,  increaseCost: 1.5,  value: 1,     increaseValue: 0.5,   tooltip: "Grains fall quicker"  } as Upgrade;
    this.upgradeDict["grainRarity"]    = {name: 'Grain Rarity (0/5)',      cost: 5,     increaseCost: 5,    value: 0.01,  increaseValue: 0.01,  tooltip: "Get more money from each successful sift"  } as Upgrade;
    this.upgradeDict["grainFrequency"] = {name: 'Grain Frequency (0/60)',  cost: 0.5,   increaseCost: 1.1,  value: 60,    increaseValue: 1,     tooltip: "More grains? What's going on?"  } as Upgrade;
  }

  clickStore() {
    this.displayStore = !this.displayStore;
  }

}
