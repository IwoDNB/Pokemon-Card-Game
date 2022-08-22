import Pokemon, { AttackSkill } from './pokemonClass.js';
import pokemons from './pokemons.js';

interface SkillType {
  name: string;
  damage: number;
  energy: number;
}

let playerTurn: 1 | 2 = 1;

const playerOneHealth = document.getElementById(
  'player_one_health'
) as HTMLSpanElement;
const playerOneEnergy = document.getElementById(
  'player_one_energy'
) as HTMLSpanElement;
const playerOneAttack = document.getElementById(
  'player_one_attack'
) as HTMLSpanElement;
const playerTwoHealth = document.getElementById(
  'player_two_health'
) as HTMLSpanElement;
const playerTwoEnergy = document.getElementById(
  'player_two_energy'
) as HTMLSpanElement;
const playerTwoAttack = document.getElementById(
  'player_two_attack'
) as HTMLSpanElement;
const gainSkillButton = document.getElementById(
  'gain_skill_btn'
) as HTMLButtonElement;
const attackOneButton = document.getElementById(
  'attack_first_btn'
) as HTMLButtonElement;
const attackTwoButton = document.getElementById(
  'attack_second_btn'
) as HTMLButtonElement;
const attackThreeButton = document.getElementById(
  'attack_third_btn'
) as HTMLButtonElement;
const attackButton = document.getElementById('attack-btn') as HTMLButtonElement;
const textDisplay = document.getElementById(
  'text_display'
) as HTMLParagraphElement;
const gainEnergyButton = document.getElementById(
  'gain_energy_btn'
) as HTMLButtonElement;

const playerOneData = pokemons.pokemons[0];
const playerTwoData = pokemons.pokemons[1];
const playerOne = new Pokemon(
  playerOneData.name,
  playerOneData.health,
  playerOneData.energy,
  [],
  undefined
);
const playerTwo = new Pokemon(
  playerTwoData.name,
  playerTwoData.health,
  playerTwoData.energy,
  [],
  undefined
);

playerOneHealth.textContent = String(playerOne.health);
playerOneEnergy.textContent = String(playerOne.energy);
playerOneAttack.textContent = 'Not yet learned';
playerTwoHealth.textContent = String(playerTwo.health);
playerTwoEnergy.textContent = String(playerTwo.energy);
playerTwoAttack.textContent = 'Not yet learned';

const getSkill = (current: SkillType[], added: SkillType[]) => {
  const remaining = added.filter(e => !current.some(k => k.name === e.name));
  return remaining.length > 1
    ? remaining[Math.floor(Math.random() * remaining.length)]
    : remaining[0];
};

const populateButtons = (player: any) => {
  if (player.skills[0]) attackOneButton.textContent = player.skills[0].name;
  if (player.skills[1]) attackTwoButton.textContent = player.skills[1].name;
  if (player.skills[2]) attackThreeButton.textContent = player.skills[2].name;
};

[attackOneButton, attackTwoButton, attackThreeButton].forEach(button => {
  button.addEventListener('click', (evt: MouseEvent) => {
    const selectedAttack = (evt.target as HTMLButtonElement).textContent;
    if (playerTurn === 1) playerOneAttack.textContent = selectedAttack;
    if (playerTurn === 2) playerTwoAttack.textContent = selectedAttack;
  });
});

gainSkillButton.addEventListener('click', (evt: MouseEvent) => {
  if (playerTurn === 1) {
    const newSkill = getSkill(playerOne.skills, playerOneData.skills);
    if (newSkill) playerOne.skills.push(newSkill);
    populateButtons(playerOne);
    return;
  }
  if (playerTurn === 2) {
    const newSkill = getSkill(playerTwo.skills, playerTwoData.skills);
    if (newSkill) playerTwo.skills.push(newSkill);
    populateButtons(playerTwo);
    return;
  }
});

attackButton.addEventListener('click', (evt: MouseEvent) => {
  //TODO: IMPLEMENT THE LOGIC FOR PLAYER TWO AS WELL
  //TODO: RESTRICT THE NUMBER OF GAINED SKILLS AND ATTACKS!
  if (playerTurn === 1) {
    if (playerOne.skills.length === 0) console.log('no skills learned');
    else {
      const foundSkill = playerOne.skills.filter(
        skill => skill.name === playerOneAttack.textContent
      )[0];
      const resultOfAnAttack = playerOne.attack(foundSkill.name, playerTwo);
      textDisplay.innerHTML = resultOfAnAttack;
      playerTwoHealth.textContent =
        playerTwo.health > 0 ? String(playerTwo.health) : 'DEAD';
      if (playerOne.energy - foundSkill.energy < 0) {
        return;
      } else {
        playerOne.energy -= foundSkill.energy;
        playerOneEnergy.textContent = String(playerOne.energy);
      }
    }
  }
  //TODO: change turn
});

gainEnergyButton.addEventListener('click', (evt: MouseEvent) => {
  if (playerTurn === 1) {
    playerOne.getMagic();
    playerOneEnergy.textContent = String(playerOne.energy);
  }
});
