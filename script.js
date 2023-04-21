const listElement = document.querySelector("ul");
const inputPokemon = document.querySelector("#inputPokemon");
const URL_API = 'https://pokeapi.co/api/v2/pokemon/';
const URL_API_SPECIES = 'https://pokeapi.co/api/v2/pokemon-species/';
let URL_IMAGE = '';

async function find(id) {
    fetch(`${URL_API}${id}`)
        .then(response => response.json())
        .then((data) => loadPokemon(data, id))
        .catch((error) => console.log(error));
}

async function loadPokemon(data, id) {

    const response = await fetch(`${URL_API_SPECIES}${id}`);
    const data_species = await response.json();

    const { abilities, height, forms, sprites, weight, types } = data;
    const { flavor_text_entries, genera } = data_species;

    const description = flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;;
    const category = genera.find(element => element.language.name === "en").genus.replace('Pokémon', '');

    const URL_API_TYPES = types["0"].type.url;
    const ability = abilities["0"].ability.name;

    const responseTypes = await fetch(`${URL_API_TYPES}`);
    const data_types = await responseTypes.json();

    const currentType = data_types.name;
    const weaknessesType = data_types.damage_relations.double_damage_from;

    for (const index in forms) {
        const item = forms[index];
        if (index == 0) {
            const liElement = document.createElement("li");
            const h2 = document.createElement("h2");
            const textH2 = document.createTextNode(item.name.toUpperCase());

            h2.appendChild(textH2);
            liElement.appendChild(h2);
            liElement.appendChild(createContentDiv(sprites.other.dream_world.front_default, description, { height, category, weight, ability }, currentType, weaknessesType))
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

function createContentDiv(sprite, description, status, type, weaknesses) {

    const contentDiv = document.createElement('div');
    const responseDiv = document.createElement('div');
    const spriteDiv = document.createElement('div');

    contentDiv.setAttribute('class', 'content-1');
    responseDiv.setAttribute('class', 'content-2');
    spriteDiv.setAttribute('class', 'sprite');

    const img = document.createElement('img');
    img.setAttribute('src', sprite);
    spriteDiv.appendChild(img);

    const p = document.createElement('p');
    p.textContent = description.replace(/\n/g, '');
    
    contentDiv.appendChild(spriteDiv);

    responseDiv.appendChild(p);
    responseDiv.appendChild(createDivPokemonStatus(status));
    responseDiv.appendChild(createDivPokemonTypes(type, weaknesses));

    contentDiv.appendChild(responseDiv);

    return contentDiv;
}


/**
* Cria uma div com os status do pokemon
* @param {object} status Objeto contendo os status do pokemon
* @returns {HTMLDivElement} Uma div com todos os status do pokemon
*/
function createDivPokemonStatus(status) {

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('details-1');

    function createDiv(title, content) {
        const div = document.createElement('div');
        const p = document.createElement('p');
        const span = document.createElement('span');

        p.textContent = title;
        span.textContent = content;

        div.appendChild(p);
        div.appendChild(span);

        return div;
    }

    for (const key in status) {
        const title = key.charAt(0).toUpperCase() + key.slice(1);
        const content = status[key];
        containerDiv.appendChild(
            createDiv(title, content)
        )
    }

    return containerDiv;
}

/**
* Cria uma div com informações do tipo e fraquezas de um pokémon
* @param {string} type O tipo do pokémon
* @param {Array} weaknesses Um array com as fraquezas do pokémon
* @returns {HTMLElement} Uma div com informações de tipo e fraquezas do pokémon
*/
function createDivPokemonTypes(type, weaknesses) {

    const containerDiv = document.createElement('div');
    containerDiv.setAttribute('id', 'details-2');
    containerDiv.setAttribute('class', 'details-2');

    const typeDiv = document.createElement('div');
    const typeP = document.createElement('p');
    typeP.textContent = 'Type';
    typeDiv.appendChild(typeP);

    const typeSpan = document.createElement('span');
    typeSpan.setAttribute('class', `type-${type}`);
    typeSpan.textContent = type.charAt(0).toUpperCase() + type.slice(1);

    const typeDiv2 = document.createElement('div');
    typeDiv2.appendChild(typeSpan);
    typeDiv.appendChild(typeDiv2);

    containerDiv.appendChild(typeDiv);

    const weaknessesDiv = document.createElement('div');
    const weaknessesP = document.createElement('p');
    const divType2 = document.createElement('div');

    weaknessesP.textContent = 'Weaknesses';
    weaknessesDiv.appendChild(weaknessesP);

    for (const index in weaknesses) {
        const weak = document.createElement('span');
        weak.setAttribute('class', `type-${weaknesses[index].name}`);
        weak.textContent = weaknesses[index].name.charAt(0).toUpperCase() + weaknesses[index].name.slice(1);
        divType2.appendChild(weak);
        weaknessesDiv.appendChild(divType2);
    }
    containerDiv.appendChild(weaknessesDiv);

    return containerDiv;
}
