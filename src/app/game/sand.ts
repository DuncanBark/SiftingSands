import { ThrowStmt } from "@angular/compiler";

export class Sand {
    x: number;
    y: number;
    w: number;
    sifted: boolean;
    rarity: number;
    weight: number;
    color: [number, number, number];
    removed: boolean;
    dustRemoved: boolean;
    opacity: number;
    dustParticles: Sand[];
    sR: number;
    sG: number;
    sB: number;

    constructor(x, y, w, weight, rarity, sR, sG, sB) {
        this.x = x;
        this.y = y;

        this.w = w;

        this.sifted = false;
        this.rarity = rarity;
        this.weight = weight;

        this.color = [sR, sG, sB];

        this.removed = false;
        this.dustRemoved = true;
        this.opacity = 255;
        this.dustParticles = [];
    }

    show(p5: any) {
        p5.fill(this.color[0], this.color[1], this.color[2]);
        p5.noStroke();

        // show dust particles if sifted, otherwise show normal sand particle
        if (this.sifted) {
            let removeDust = true;
            let wW = p5.windowWidth;
            let wH = p5.windowHeight;
            for (let i = 0; i < this.dustParticles.length; i++) {
                removeDust = updateDust(this.dustParticles[i], this.opacity);
                if (this.dustParticles[i].y >= wH || (this.dustParticles[i].x >= wW || this.dustParticles[i].x <= 0) || removeDust || Math.random() < 0.005) {
                    this.dustParticles.splice(i, 1);
                }
            }
            this.opacity -= 0.25;
        } else {
            p5.ellipse(this.x, this.y, this.w);
        }

        this.dustRemoved = this.dustParticles.length == 0;

        function updateDust(dust, opacity) {
            if (opacity > 0) {
                dust.update();
                p5.fill(dust.color, opacity);
                p5.noStroke();
                p5.ellipse(dust.x, dust.y, dust.w);
            } else {
                return true;
            }
            return false;
        }
    }

    update() {
        let random_val = Math.random();
        let jitter_chance = Math.random()

        let rand_weight = Math.random() * (this.weight - 2) + 2;

        // jitter particle horizontally 
        // let jitterValueX = 2 - this.weight;
        let jitterValueX = 2 - rand_weight;
        if (jitterValueX <= 1) {
            jitterValueX = 1;
        }
        if (jitter_chance >= 0.5) { // 50% chance to jitter left or right
            this.x += (jitterValueX * random_val); // jitter right
        } else {
            this.x -= (jitterValueX * random_val); // jitter left
        }

        //jitter particle vertically
        // let jitterValueY = 4 - this.weight;
        let jitterValueY = 4 - rand_weight;
        if (jitterValueY <= 0) {
            // jitterValueY = this.weight;
            jitterValueY = rand_weight;
        }
        if (jitter_chance >= 0.01) { // 1% chance to jitter upwards
            // this.y += (this.weight * random_val);
            this.y += (rand_weight * random_val);
        } else {
            this.y -= (jitterValueY * random_val);
        }
    }

    sift(siftEff) {

        this.dustRemoved = false;

        // create 2-4 dust particles after sifting
        for (let i = 0; i < Number(Math.random() * 3) + 2; i++) {
            this.dustParticles.push(new Sand(this.x, this.y, this.w/2, this.weight/1.5, this.rarity, this.sR, this.sG, this.sB));
        }

        // if efficiency check passes, return rarity (as money)
        if (Math.random() <= siftEff) {
            this.sifted = true;
            return this.rarity;
        } else {
            this.sifted = true;
        }
        return 0;
    }
}
