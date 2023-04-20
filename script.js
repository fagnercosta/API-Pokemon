
const listElement = document.querySelector("ul");
const inputPokemon = document.querySelector("#inputPokemon");
const URL_API = 'https://pokeapi.co/api/v2/pokemon/';
const URL_API_SPECIES = 'https://pokeapi.co/api/v2/pokemon-species/';
let URL_IMAGE = '';

async function find(id) {
    await fetch(`${URL_API}${id}`)
        .then(response => response.json())
        .then((data) => loadPokemon(data, id))
        .catch((error) => { console.log(error) });
}

async function loadPokemon(data, id) {

    const dataSpecies = await fetch(`${URL_API_SPECIES}${id}`)
        .then(response => response.json())
        .catch((error) => { console.log(error) });

    const { abilities, height, forms, sprites, weight, types } = data;
    const { flavor_text_entries, genera } = dataSpecies;

    const ability = abilities["0"].ability.name;
    const description = flavor_text_entries.find(element => (element.version.name === "red" && element.language.name === "en")).flavor_text;
    const category = genera.find(element => element.language.name === "en").genus.replace('Pokémon', '');
    const URL_API_TYPES = types["0"].type.url;

    for (const index in forms) {
        const item = forms[index];

        if (index == 0) {
            const liElement = document.createElement("li");
            const div = document.createElement("div");
            const h2 = document.createElement("h2");
            const span = document.createElement("span");
            const textH2 = document.createTextNode(item.name.toUpperCase());
            const textSpan = document.createTextNode("Biografia");
            const img = document.createElement("img");

            img.setAttribute("src", sprites.other.dream_world.front_default);
            h2.appendChild(textH2);
            span.appendChild(textSpan);
            liElement.appendChild(h2);
            div.appendChild(img);
            div.appendChild(span);
            liElement.appendChild(div);
            listElement.appendChild(liElement);
        }
    }
}

function clearElement(elemento) {
    listElement.innerHTML = '';
}

function search(event) {
    event.preventDefault();
    clearElement(listElement);
    const inputValue = inputPokemon.value.toLowerCase();
    find(inputValue);
}