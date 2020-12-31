export class Upgrade {
    name: string;
    cost: number;
    increaseCost: number;
    value: number;
    increaseValue: number;
    quantity: [number, number];
    tooltip: string;

    constructor(name: string, cost: number, increaseCost: number, value: number, increaseValue: number, quantity: [number, number], tooltip: string) {
        this.name = name;
        this.cost = cost;
        this.increaseCost = increaseCost;
        this.value = value;
        this.increaseValue = increaseValue;
        this.quantity = quantity;
        this.tooltip = tooltip;
    }

    // returns new money amount
    buyUpgrade(money: number, max: boolean): number {
        do {
            if (money >= this.cost) {
                if (this.quantity[0] !== this.quantity[1]) {
                    money -= this.cost;
                    this.cost *= this.increaseCost;
                    this.value += this.increaseValue;
                    this.quantity[0] += 1;
                    continue;
                } else {
                    this.cost = -1;
                }
            }
            max = false;
        } while (max);
        return money;
    }
}