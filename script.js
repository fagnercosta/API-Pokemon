
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

    const dataTypes = await fetch(`${URL_API_TYPES}`)
        .then(response => response.json())
        .catch((error) => { console.log(error) });

    const currentType = dataTypes.name;
    const weaknessesType = dataTypes.damage_relations.double_damage_from;

    for (const index in forms) {
        const item = forms[index];

        if (index == 0) {
            const liElement = document.createElement("li");
            const div = document.createElement("div");
            div.setAttribute('id', 'content-1')
            div.setAttribute('class', 'content-1')
            const h2 = document.createElement("h2");
            const p = document.createElement("p");
            p.innerText = description.replace(/\n/g, "");
            const textH2 = document.createTextNode(item.name.toUpperCase());
            const img = document.createElement("img");

            img.setAttribute("src", sprites.other.dream_world.front_default);
            h2.appendChild(textH2);
            liElement.appendChild(h2);
            div.appendChild(img);
            div.appendChild(p);
            liElement.appendChild(div);
            const details = createDetailsDivs(height, category, weight, ability, currentType, weaknessesType)
            liElement.appendChild(details[0]);
            liElement.appendChild(details[1]);
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

function createDetailsDivs(height, category, weight, ability, types, weaknesses) {
    // Cria a primeira div com todos os seus elementos filhos
    const details1Div = document.createElement('div');
    details1Div.setAttribute('id', 'details-1');
    details1Div.setAttribute('class', 'details-1');

    const heightDiv = document.createElement('div');
    const heightP = document.createElement('p');
    heightP.textContent = 'Height';
    const heightSpan = document.createElement('span');
    heightSpan.textContent = `${height} m`;
    heightDiv.appendChild(heightP);
    heightDiv.appendChild(heightSpan);
    details1Div.appendChild(heightDiv);

    const categoryDiv = document.createElement('div');
    const categoryP = document.createElement('p');
    categoryP.textContent = 'Category';
    const categorySpan = document.createElement('span');
    categorySpan.textContent = `${category}`;
    categoryDiv.appendChild(categoryP);
    categoryDiv.appendChild(categorySpan);
    details1Div.appendChild(categoryDiv);

    const weightDiv = document.createElement('div');
    const weightP = document.createElement('p');
    weightP.textContent = 'Weight';
    const weightSpan = document.createElement('span');
    weightSpan.textContent = `${weight/10} kg`;
    weightDiv.appendChild(weightP);
    weightDiv.appendChild(weightSpan);
    details1Div.appendChild(weightDiv);

    const abilitiesDiv = document.createElement('div');
    const abilitiesP = document.createElement('p');
    abilitiesP.textContent = 'Abilities';
    const abilitiesSpan = document.createElement('span');
    abilitiesSpan.textContent = `${ability.charAt(0).toUpperCase() + ability.slice(1)}`
    abilitiesDiv.appendChild(abilitiesP);
    abilitiesDiv.appendChild(abilitiesSpan);
    details1Div.appendChild(abilitiesDiv);

    // Cria a segunda div com todos os seus elementos filhos
    const details2Div = document.createElement('div');
    details2Div.setAttribute('id', 'details-2');
    details2Div.setAttribute('class', 'details-2');
    const divType1 = document.createElement('div');
    const typeDiv = document.createElement('div');
    const typeP = document.createElement('p');
    typeP.textContent = 'Type';
    typeDiv.appendChild(typeP);

    if (typeof(types) === "string") {
        const typeSpan = document.createElement('span');
        typeSpan.setAttribute('class', `type-${types}`);
        typeSpan.textContent = types.charAt(0).toUpperCase() + types.slice(1);
        divType1.appendChild(typeSpan);
        typeDiv.appendChild(divType1)
        details2Div.appendChild(typeDiv);
    }

    const weaknessesDiv = document.createElement('div');
    const weaknessesP = document.createElement('p');
    const divType2 = document.createElement('div');

    weaknessesP.textContent = 'Weaknesses';
    weaknessesDiv.appendChild(weaknessesP);
    
    for (const index in weaknesses) {
        const weak = document.createElement('span');
        weak.setAttribute('class', `type-${weaknesses[index].name}`);
        weak.textContent = weaknesses[index].name.charAt(0).toUpperCase() + weaknesses[index].name.slice(1);
        divType2.appendChild(weak)
        weaknessesDiv.appendChild(divType2);
    }
    
    details2Div.appendChild(weaknessesDiv);
    // Retorna uma lista com as duas divs
    return [details1Div, details2Div];
}
