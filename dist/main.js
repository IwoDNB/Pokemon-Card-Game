import Pokemon from './pokemonClass.js';
let playerTurn = 1;
let actionsLeft = 2;
const playerOneHealth = document.getElementById('player_one_health');
const playerOneEnergy = document.getElementById('player_one_energy');
const playerOneAttack = document.getElementById('player_one_attack');
const playerTwoHealth = document.getElementById('player_two_health');
const playerTwoEnergy = document.getElementById('player_two_energy');
const playerTwoAttack = document.getElementById('player_two_attack');
const gainSkillButton = document.getElementById('gain_skill_btn');
const attackOneButton = document.getElementById('attack_first_btn');
const attackTwoButton = document.getElementById('attack_second_btn');
const attackThreeButton = document.getElementById('attack_third_btn');
const attackButton = document.getElementById('attack-btn');
const textDisplay = document.getElementById('text_display');
const gainEnergyButton = document.getElementById('gain_energy_btn');
const endTurnButton = document.querySelector('#end_turn_btn');
const playerOneName = document.getElementById('player_one_name');
const playerTwoName = document.getElementById('player_two_name');
const playerOneImage = document.getElementById('player-one-image');
const playerTwoImage = document.getElementById('player-two-image');
const playerOneData = JSON.parse(localStorage.getItem('playerOne'));
const playerTwoData = JSON.parse(localStorage.getItem('playerTwo'));
playerOneName.textContent = playerOneData.name;
playerTwoName.textContent = playerTwoData.name;
playerOneImage.src = `./img/newImages/${playerOneData.name}.jpg`;
playerTwoImage.src = `./img/newImages/${playerTwoData.name}.jpg`;
const playerOne = new Pokemon(playerOneData.name, playerOneData.health, playerOneData.energy, [], undefined);
const playerTwo = new Pokemon(playerTwoData.name, playerTwoData.health, playerTwoData.energy, [], undefined);
playerOneHealth.textContent = String(playerOne.health);
playerOneEnergy.textContent = String(playerOne.energy);
playerOneAttack.textContent = 'Not yet learned';
playerTwoHealth.textContent = String(playerTwo.health);
playerTwoEnergy.textContent = String(playerTwo.energy);
playerTwoAttack.textContent = 'Not yet learned';
const getSkill = (current, added) => {
    const remaining = added.filter(e => !current.some(k => k.name === e.name));
    return remaining.length > 1
        ? remaining[Math.floor(Math.random() * remaining.length)]
        : remaining[0];
};
const populateButtons = (player) => {
    [attackOneButton, attackTwoButton, attackThreeButton].forEach((button, i) => {
        button.textContent = player.skills[i]
            ? player.skills[i].name
            : 'Not learned';
    });
};
[attackOneButton, attackTwoButton, attackThreeButton].forEach(button => {
    button.addEventListener('click', (evt) => {
        const selectedAttack = evt.target.textContent;
        if (playerTurn === 1)
            playerOneAttack.textContent = selectedAttack;
        if (playerTurn === 2)
            playerTwoAttack.textContent = selectedAttack;
    });
});
gainSkillButton.addEventListener('click', (evt) => {
    if (playerTurn === 1) {
        if (actionsLeft > 0) {
            if (playerOne.skills.length === 3) {
                textDisplay.innerHTML = `<p> No more skills to gain </p>`;
                return;
            }
            const newSkill = getSkill(playerOne.skills, playerOneData.skills);
            if (newSkill)
                playerOne.skills.push(newSkill);
            populateButtons(playerOne);
            actionsLeft -= 1;
            return;
        }
        else {
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
            if (newSkill)
                playerTwo.skills.push(newSkill);
            populateButtons(playerTwo);
            actionsLeft -= 1;
            return;
        }
        else {
            textDisplay.innerHTML = `<p>Not actions left</p>`;
        }
    }
});
attackButton.addEventListener('click', (evt) => {
    if (playerTurn === 1) {
        if (playerOne.skills.length === 0)
            textDisplay.innerHTML = '<p> No skill gained <p>';
        else {
            if (actionsLeft > 0) {
                const foundSkill = playerOne.skills.filter(skill => skill.name === playerOneAttack.textContent)[0];
                const resultOfAnAttack = playerOne.attack(foundSkill.name, playerTwo);
                textDisplay.innerHTML = resultOfAnAttack;
                playerTwoHealth.textContent =
                    playerTwo.health > 0 ? String(playerTwo.health) : 'DEAD';
                if (playerOne.energy - foundSkill.energy < 0) {
                    return;
                }
                else {
                    playerOne.energy -= foundSkill.energy;
                    playerOneEnergy.textContent = String(playerOne.energy);
                    actionsLeft -= 1;
                }
            }
            else {
                textDisplay.innerHTML = `<p>Not actions left</p>`;
            }
        }
    }
    if (playerTurn === 2) {
        if (playerTwo.skills.length === 0)
            textDisplay.innerHTML = '<p> No skill gained <p>';
        else {
            if (actionsLeft > 0) {
                const foundSkill = playerTwo.skills.filter(skill => skill.name === playerTwoAttack.textContent)[0];
                const resultOfAnAttack = playerTwo.attack(foundSkill.name, playerTwo);
                textDisplay.innerHTML = resultOfAnAttack;
                playerOneHealth.textContent =
                    playerOne.health > 0 ? String(playerOne.health) : 'DEAD';
                if (playerTwo.energy - foundSkill.energy < 0) {
                    return;
                }
                else {
                    playerTwo.energy -= foundSkill.energy;
                    playerTwoEnergy.textContent = String(playerTwo.energy);
                    actionsLeft -= 1;
                }
            }
            else {
                textDisplay.innerHTML = `<p>Not actions left</p>`;
            }
        }
    }
});
gainEnergyButton.addEventListener('click', (evt) => {
    if (playerTurn === 1) {
        if (actionsLeft > 0) {
            playerOne.getMagic();
            actionsLeft -= 1;
            playerOneEnergy.textContent = String(playerOne.energy);
        }
        else {
            textDisplay.innerHTML = `<p>Not actions left</p>`;
        }
    }
    if (playerTurn === 2) {
        if (actionsLeft > 0) {
            playerTwo.getMagic();
            actionsLeft -= 1;
            playerTwoEnergy.textContent = String(playerTwo.energy);
        }
        else {
            textDisplay.innerHTML = `<p>Not actions left</p>`;
        }
    }
});
endTurnButton.addEventListener('click', (evt) => {
    actionsLeft = 2;
    playerTurn = playerTurn === 1 ? 2 : 1;
    const player = playerTurn === 1 ? playerOne : playerTwo;
    populateButtons(player);
});
