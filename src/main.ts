interface AttackSkillType {
  name: string;
  damage: number;
  energy: number;
}
interface PokemonType {
  name: string;
  health: number;
  energy: number;
  skills: AttackSkillType[];
  learnAttackSkill: (v: AttackSkillType) => void;
  showStatus: () => string;
  attack: (k: string, t: Pokemon) => string;
  getMagic: () => string;
}

class Pokemon implements PokemonType {
  constructor(
    public name: string,
    public health: number,
    public energy: number,
    public skills: AttackSkillType[]
  ) {}
  learnAttackSkill(newAttack: AttackSkillType): void {
    this.skills.push(newAttack);
  }
  showStatus(): string {
    return `${this.name} status \n health:${this.health}\n magic: ${this.energy}`;
  }
  attack(skill: string, target: Pokemon): string {
    if (this.health <= 0) return `${this.name} is already dead!`;
    const attack = this.skills.find(e => skill === e.name);
    if (!attack) return 'Skill not yet learned';
    if (attack?.energy > this.energy) return 'Not enough energy';
    this.energy -= attack.energy;
    target.health -= attack.damage;
    if (target.health <= 0) return `${target.name} is dead!`;
    else
      return `${this.name} launched skill ${attack.name} successfully!\n ${target.name} got ${attack.damage} damage`;
  }
  getMagic(): string {
    const addedEnergy = Math.floor(Math.random() * 30 + 20);
    this.energy += addedEnergy;
    return `${this.name} got ${addedEnergy} energy back`;
  }
}

class AttackSkill implements AttackSkillType {
  constructor(
    public name: string,
    public damage: number,
    public energy: number
  ) {}
}
