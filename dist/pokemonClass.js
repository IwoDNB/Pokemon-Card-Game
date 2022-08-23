export default class Pokemon {
    name;
    health;
    energy;
    skills;
    currentAttack;
    constructor(name, health, energy, skills, currentAttack) {
        this.name = name;
        this.health = health;
        this.energy = energy;
        this.skills = skills;
        this.currentAttack = currentAttack;
    }
    learnAttackSkill(newAttack) {
        this.skills.push(newAttack);
    }
    showStatus() {
        return `${this.name} status \n health:${this.health}\n magic: ${this.energy}`;
    }
    attack(skill, target) {
        if (this.health <= 0)
            return `${this.name} is already dead!`;
        const attack = this.skills.find(e => skill === e.name);
        if (!attack)
            return 'Skill not yet learned';
        if (attack?.energy > this.energy)
            return 'Not enough energy';
        this.energy -= attack.energy;
        target.health -= attack.damage;
        if (target.health <= 0)
            return `${target.name} is dead!`;
        else
            return `<p>${this.name} launched skill ${attack.name} successfully!</p> <p> ${target.name} got ${attack.damage} damage </p>`;
    }
    getMagic() {
        const addedEnergy = Math.floor(Math.random() * 20 + 11);
        this.energy += addedEnergy;
        return `${this.name} got ${addedEnergy} energy back`;
    }
}
export class AttackSkill {
    name;
    damage;
    energy;
    constructor(name, damage, energy) {
        this.name = name;
        this.damage = damage;
        this.energy = energy;
    }
}
