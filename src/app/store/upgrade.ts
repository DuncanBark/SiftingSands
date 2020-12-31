export class Upgrade {
    name: string;
    cost: number;
    increaseCost: number;
    value: number;
    increaseValue: number;
    tooltip: string;

    constructor(name: string, cost: number, increaseCost: number, value: number, increaseValue: number, tooltip: string) {
        this.name = name;
        this.cost = cost;
        this.increaseCost = increaseCost;
        this.value = value;
        this.increaseValue = increaseValue;
        this.tooltip = tooltip;
    }

    // returns [new money amount, new upgrade value]
    buyUpgrade(money: number) {
        if (money >= this.cost) {
            this.cost += this.cost*this.increaseCost;
            this.value += this.increaseValue;
            return [money -= this.cost, this.value];
        }
    }
}