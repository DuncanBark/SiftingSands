export function draw_sifter(p5, offScreen: boolean, holdSift: boolean, optionDict, siftX: number, curRange: number, siftY: number) {
    if (!offScreen || holdSift) {
        let sR = Number(optionDict["Sifter color (Red)"].value)
        let sG = Number(optionDict["Sifter color (Green)"].value)
        let sB = Number(optionDict["Sifter color (Blue)"].value)
        p5.stroke(p5.color(sR, sG, sB));
        p5.strokeWeight(2)
        p5.line(siftX-curRange, siftY, siftX+curRange, siftY);
    }
    return
}

export function create_grain(p5, curFrequency: number, grains, curWeight: number, curRarity: number, Sand, upgradeDict, optionDict, start_sand: boolean) {
    let grainWidth = 5 + (upgradeDict["Grain Weight"].quantity[0] / 8);
        let sR = Number(optionDict["Sand color (Red)"].value)
        let sG = Number(optionDict["Sand color (Green)"].value)
        let sB = Number(optionDict["Sand color (Blue)"].value)
        if (p5.frameCount % 60 == 0 && start_sand) {
          for (let i = 0; i <= curFrequency; i++) {
            grains.push(new Sand(Math.random()*p5.width, Math.random()*-300, grainWidth, curWeight, curRarity, sR, sG, sB));
          }
        }
}

export function update_grain(p5, grain, offScreen: boolean, holdSift: boolean, siftX: number, curRange: number, siftY: number, money: number, curEfficiency: number): [boolean, number] {
    if (grain.removed) {
        return [true, money];
    }

    grain.show(p5);

    // if all the dust has been removed
    if (grain.dustRemoved && grain.sifted) {
        grain.removed = true;
        return [true, money];
    }

    grain.update();
    let gX = grain.x;
    let gY = grain.y;
    let wH = p5.windowHeight;
    let wW = p5.windowWidth;

    // if the grain itself goes off the window remove it
    if ((gY >= wH || (gX >= wW || gX <= 0)) && !grain.sifted){
        grain.removed = true;
        return [true, money];
    }

    // sifting if mouse is in range of sand particle and the mouse is on screen
    if (!offScreen || holdSift) {
        if (siftX >= gX - curRange && siftX <= (gX + curRange)) {
            if (siftY >= (gY - 10) && siftY <= (gY + 5)) {
                if (!grain.sifted) {
                    money += grain.sift(curEfficiency);
                }
            }
        }
    }

    return [false, money];
}

export function mouse_clicked(p5, siftX: number, curRange: number, siftY: number, offScreen: boolean, cursor: string, start_sand: boolean, holdSift: boolean): [boolean, string, number, number, boolean] {
    let on_sifter = check_cursor(p5, siftX, curRange, siftY, offScreen, cursor, true)
    if (on_sifter == true) {
        start_sand = true;
        holdSift = !holdSift;
        siftX = p5.mouseX;
        siftY = p5.mouseY;
    }
    return [start_sand, cursor, siftX, siftY, holdSift]
}

export function check_cursor(p5, siftX, curRange, siftY, offScreen, cursor, mouse_clicked) {
    let distanceX = p5.mouseX >= (siftX-curRange-7) && p5.mouseX <= (siftX+curRange+7)
    let distanceY = Math.abs(p5.mouseY - siftY) <= 7;
    if (!offScreen && (distanceX && distanceY)) {
        cursor = "grabbing"
        if (mouse_clicked) {
            return true
        }
    } else {
        cursor = "grab"
    }
    return cursor
}

export function required_drawing(css_cursor, cursor: string, p5, optionDict) {
    css_cursor[0].style.cursor = cursor
    p5.clear();
    let bR = Number(optionDict["Background color (Red)"].value)
    let bG = Number(optionDict["Background color (Green)"].value)
    let bB = Number(optionDict["Background color (Blue)"].value)
    p5.background(p5.color(bR, bG, bB));
}