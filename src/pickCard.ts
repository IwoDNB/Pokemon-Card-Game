import pokemos from './pokemons.js';
localStorage.clear();
const cards = document.querySelectorAll<HTMLDivElement>(
  '.flip-card'
) as NodeListOf<HTMLDivElement>;

const found: any[] = [];
cards.forEach(card => {
  const foundPokemon = pokemos.pokemons.filter(
    pokemon =>
      pokemon.name ===
      card.childNodes[1].childNodes[1].childNodes[3].textContent?.toLocaleLowerCase()
  )[0];
  card.childNodes[1].childNodes[1].childNodes[5].childNodes[1].childNodes[2].textContent =
    String(foundPokemon.health);
  card.childNodes[1].childNodes[1].childNodes[5].childNodes[3].childNodes[2].textContent =
    String(foundPokemon.energy);
});

cards.forEach(card => {
  card.addEventListener('click', (evt: MouseEvent) => {
    if (localStorage.length < 2) card.style.display = 'none';

    const foundPokemon = pokemos.pokemons.filter(
      pokemon =>
        pokemon.name ===
        card.childNodes[1].childNodes[1].childNodes[3].textContent?.toLocaleLowerCase()
    )[0];

    if (localStorage.length === 1) {
      localStorage.setItem('playerTwo', JSON.stringify(foundPokemon));
    }
    if (localStorage.length === 0) {
      localStorage.setItem('playerOne', JSON.stringify(foundPokemon));
    }
  });
});
