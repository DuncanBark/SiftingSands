export class Sand {
    x: number;
    y: number;
    w: number;
    sifted: boolean;
    rarity: number;
    weight: number;
    color: number;
    dustParticles: Sand[];

    constructor(x, y, w, weight, rarity) {
        this.x = x;
        this.y = y;

        this.w = w;

        this.sifted = false;
        this.rarity = rarity;
        this.weight = weight;

        this.color = 200;

        this.dustParticles = [];
    }

    show(p5: any) {
        p5.fill(this.color);
        p5.noStroke();

        // show dust particles if sifted, otherwise show normal sand particle
        if (this.sifted) {
            this.dustParticles.forEach( function(dust) {
                dust.update();
                p5.fill(dust.color);
                p5.noStroke();
                p5.ellipse(dust.x, dust.y, dust.w);
            });
        } else {
            p5.ellipse(this.x, this.y, this.w);
        }
    }

    update() {
        // jitter particle horizontally 
        let jitterValueX = 2 - this.weight;
        if (jitterValueX <= 1) {
            jitterValueX = 1;
        }
        if (Math.random() >= 0.5) { // 50% chance to jitter left or right
            this.x += (jitterValueX * Math.random()); // jitter right
        } else {
            this.x -= (jitterValueX * Math.random()); // jitter left
        }

        //jitter particle vertically
        let jitterValueY = 4 - this.weight;
        if (jitterValueY <= 0) {
            jitterValueY = this.weight;
        }
        if (Math.random() >= 0.01) { // 1% chance to jitter upwards
            this.y += (this.weight * Math.random());
        } else {
            this.y -= (jitterValueY * Math.random());
        }
    }

    sift(siftEff) {
        // create 2-4 dust particles after sifting
        for (let i = 0; i < Number(Math.random() * 3) + 2; i++) {
            this.dustParticles.push(new Sand(this.x, this.y, this.w/2, this.weight/1.5, this.rarity));
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