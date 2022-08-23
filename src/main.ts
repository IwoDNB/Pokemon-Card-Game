import Pokemon, { AttackSkill } from './pokemonClass.js';
import { type AttackSkillType } from './pokemonClass';
import pokemons from './pokemons.js';

let playerTurn: 1 | 2 = 1;
let actionsLeft: 0 | 1 | 2 = 2;

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
const endTurnButton = document.querySelector<HTMLButtonElement>(
  '#end_turn_btn'
) as HTMLButtonElement;
const playerOneName = document.getElementById(
  'player_one_name'
) as HTMLButtonElement;
const playerTwoName = document.getElementById(
  'player_two_name'
) as HTMLButtonElement;
const playerOneImage = document.getElementById(
  'player-one-image'
) as HTMLImageElement;
const playerTwoImage = document.getElementById(
  'player-two-image'
) as HTMLImageElement;

const playerOneData = JSON.parse(localStorage.getItem('playerOne') as string);
const playerTwoData = JSON.parse(localStorage.getItem('playerTwo') as string);
playerOneName.textContent = playerOneData.name;
playerTwoName.textContent = playerTwoData.name;

playerOneImage.src = `./img/newImages/${playerOneData.name}.jpg`;
playerTwoImage.src = `./img/newImages/${playerTwoData.name}.jpg`;

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

const getSkill = (current: AttackSkillType[], added: AttackSkillType[]) => {
  const remaining = added.filter(e => !current.some(k => k.name === e.name));
  return remaining.length > 1
    ? remaining[Math.floor(Math.random() * remaining.length)]
    : remaining[0];
};

const populateButtons = (player: any) => {
  [attackOneButton, attackTwoButton, attackThreeButton].forEach((button, i) => {
    button.textContent = player.skills[i]
      ? player.skills[i].name
      : 'Not learned';
  });
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
    if (actionsLeft > 0) {
      if (playerOne.skills.length === 3) {
        textDisplay.innerHTML = `<p> No more skills to gain </p>`;
        return;
      }
      const newSkill = getSkill(playerOne.skills, playerOneData.skills);
      if (newSkill) playerOne.skills.push(newSkill);
      populateButtons(playerOne);
      actionsLeft -= 1;
      return;
    } else {
      textDisplay.innerHTML = `<p>Not actions left</p>`;
    }
  }
  if (playerTurn === 2) {
    if (actionsLeft > 0) {
      if (playerTwo.skills.length === 3) {
        textDisplay.innerHTML = `<p> No more skills to gain </p>`;
        return;
      }
      const newSkill = getSkill(playerTwo.skills, playerTwoData.skills);
      if (newSkill) playerTwo.skills.push(newSkill);
      populateButtons(playerTwo);
      actionsLeft -= 1;
      return;
    } else {
      textDisplay.innerHTML = `<p>Not actions left</p>`;
    }
  }
});

attackButton.addEventListener('click', (evt: MouseEvent) => {
  if (playerTurn === 1) {
    if (playerOne.skills.length === 0)
      textDisplay.innerHTML = '<p> No skill gained <p>';
    else {
      if (actionsLeft > 0) {
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
          actionsLeft -= 1;
        }
      } else {
        textDisplay.innerHTML = `<p>Not actions left</p>`;
      }
    }
  }
  if (playerTurn === 2) {
    if (playerTwo.skills.length === 0)
      textDisplay.innerHTML = '<p> No skill gained <p>';
    else {
      if (actionsLeft > 0) {
        const foundSkill = playerTwo.skills.filter(
          skill => skill.name === playerTwoAttack.textContent
        )[0];
        const resultOfAnAttack = playerTwo.attack(foundSkill.name, playerTwo);
        textDisplay.innerHTML = resultOfAnAttack;
        playerOneHealth.textContent =
          playerOne.health > 0 ? String(playerOne.health) : 'DEAD';
        if (playerTwo.energy - foundSkill.energy < 0) {
          return;
        } else {
          playerTwo.energy -= foundSkill.energy;
          playerTwoEnergy.textContent = String(playerTwo.energy);
          actionsLeft -= 1;
        }
      } else {
        textDisplay.innerHTML = `<p>Not actions left</p>`;
      }
    }
  }
});

gainEnergyButton.addEventListener('click', (evt: MouseEvent) => {
  if (playerTurn === 1) {
    if (actionsLeft > 0) {
      playerOne.getMagic();
      actionsLeft -= 1;
      playerOneEnergy.textContent = String(playerOne.energy);
    } else {
      textDisplay.innerHTML = `<p>Not actions left</p>`;
    }
  }
  if (playerTurn === 2) {
    if (actionsLeft > 0) {
      playerTwo.getMagic();
      actionsLeft -= 1;
      playerTwoEnergy.textContent = String(playerTwo.energy);
    } else {
      textDisplay.innerHTML = `<p>Not actions left</p>`;
    }
  }
});

endTurnButton.addEventListener('click', (evt: MouseEvent) => {
  actionsLeft = 2;
  playerTurn = playerTurn === 1 ? 2 : 1;
  const player = playerTurn === 1 ? playerOne : playerTwo;
  populateButtons(player);
});
