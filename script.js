let cardheader = document.querySelector('.hm');
let headerframe = document.querySelector('.pokemon-card-header');
let pokemonimage = document.querySelector('.pokemonimage');
let description = document.querySelector('.description');
let menu = document.querySelector('.pokemon-select-menu');
let pokemoncard = document.querySelector('.pokemon-card');
let input = document.querySelector('.search-bar');
let loading = document.querySelector('.loading');
let loadingdata = document.querySelector('.loadingdata');
let loadingdata2 = document.querySelector('.loadingdata2');
let toggle = document.querySelector('.darklighttoggle');
let toggleimg = document.querySelector('.darklighttoggleimg');
let light = true;

const pokemonCount = 1025;
let pokedex = {};
let completedLoading;

window.onload = async function() {


    for (let i = 1; i <= pokemonCount; i++) {
        await getPokemon(i);

        let pokemon = document.createElement('div');
        pokemon.id = i;

        setInterval(() => {
            if (pokemon.id === 100) {
                completeLoading();
                console.log('it works');
                clearInterval();
            }
        }, 100);
        pokemon.classList.add('pokemon-name');


        pokemon.innerText = `${i}` + '. ' + pokedex[i].name.toUpperCase();

        pokemon.addEventListener('click', function() {
            for (let j = 1; j <= pokemonCount; j++) {
                document.querySelectorAll(`.pokemon-name`)[j - 1].style.background = '#e92f30';
                document.querySelectorAll(`.pokemon-name`)[j - 1].style.boxShadow = 'inset 0px 0px 0px 10px #910F21';
                document.querySelectorAll(`.pokemon-name`)[j - 1].style.color = 'black';
            }



            pokemon.style.background = '#910F21';
            pokemon.style.boxShadow = 'inset 0px 0px 0px 10px #AEB6B8';
            pokemon.style.color = '#E92F30';





            if (pokedex[i].name.toUpperCase() !== cardheader.innerText) {
                pokemoncard.style.opacity = 0;
                setTimeout(() => {
                    pokemonimage.src = pokedex[pokemon.id]['img'];
                    pokemonimage.alt = pokedex[pokemon.id]['name'];
                    cardheader.innerText = pokedex[pokemon.id]['name'].toUpperCase();
                    cardheader.style.fontSize = '15px';
                    cardheader.style.fontSize = 'min(25vw, 25px)';

                    setTimeout(() => {
                        pokemoncard.style.opacity = 1;
                    }, 100);
                }, 400);
            }

            if (pokedex[pokemon.id]['type2'] && pokedex[pokemon.id]['species']['evolves_from_species'] && pokedex[pokemon.id]['species']['evolves_from_species']['name']) {
                description.innerText = pokedex[pokemon.id]['name'] + ', the ' + pokedex[pokemon.id]['type1'] + ' and ' + pokedex[pokemon.id]['type2'] + ' type Pokémon, and the evolved form of ' + pokedex[pokemon.id]['species']['evolves_from_species']['name'].toUpperCase() + '. ' + pokedex[pokemon.id]['desc'];
            } else if (!pokedex[pokemon.id]['type2'] && pokedex[pokemon.id]['species']['evolves_from_species'] && pokedex[pokemon.id]['species']['evolves_from_species']['name']) {
                description.innerText = pokedex[pokemon.id]['name'] + ', the ' + pokedex[pokemon.id]['type1'] + ' type Pokémon, and the evolved form of ' + pokedex[pokemon.id]['species']['evolves_from_species']['name'].toUpperCase() + '. ' + pokedex[pokemon.id]['desc'];
            } else if (!pokedex[pokemon.id]['type2'] && !pokedex[pokemon.id]['species']['evolves_from_species']) {
                description.innerText = pokedex[pokemon.id]['name'] + ', the ' + pokedex[pokemon.id]['type1'] + ' type Pokémon. ' + pokedex[pokemon.id]['desc'];
            } else {
                description.innerText = pokedex[pokemon.id]['name'] + ', the ' + pokedex[pokemon.id]['type1'] + ' type Pokémon. ' + pokedex[pokemon.id]['desc'];
            }
        });




        console.log(pokemon.id);

        setInterval(function() {
            if (pokemon.id >= 1024) {
                console.log('worked');
                completeLoading();
                clearInterval();
            }
        }, 100);

        menu.append(pokemon);
    }
}

async function getPokemon(num) {
    let url = `https://pokeapi.co/api/v2/pokemon/${num}`;

    try {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        let pokemon = await response.json();
        // console.log(pokemon);

        let pokemonName = pokemon["name"];
        let pokemonType = pokemon["types"][0]["type"]["name"];
        let pokemonType2 = false;

        if (pokemon["types"][1] && pokemon["types"][1]["type"]) {
            pokemonType2 = pokemon["types"][1]["type"]["name"];
        } else {
            pokemonType2 = false;
        }
        let pokemonImg = pokemon["sprites"]["front_default"];

        res = await fetch(pokemon['species']['url']);
        let pokemonSpecies = await res.json();

        let pokemonDescription = '';

        if (pokemonSpecies['flavor_text_entries'][9] && pokemonSpecies['flavor_text_entries'][9]['language'] && pokemonSpecies['flavor_text_entries'][9]['language']['name'] == 'en') {
            pokemonDescription = pokemonSpecies['flavor_text_entries'][9]['flavor_text'];
        } else if (pokemonSpecies['flavor_text_entries'][0] && pokemonSpecies['flavor_text_entries'][0]['language'] && pokemonSpecies['flavor_text_entries'][0]['language']['name'] == 'en') {
            pokemonDescription = pokemonSpecies['flavor_text_entries'][0]['flavor_text'];
        } else {
            for (let i = 0; i < pokemonSpecies['flavor_text_entries'].length; i++) {
                if (pokemonSpecies['flavor_text_entries'][i]['language']['name'] == 'en') {
                    pokemonDescription = pokemonSpecies['flavor_text_entries'][i]['flavor_text'];
                    break;
                }
            }
        }

        if (pokemonDescription == false) {
            pokemonDescription = 'No description available.';
        }

        // console.log(pokemonSpecies);
        // console.log(pokemonDescription);

        pokedex[num] = {
            name: pokemonName.toUpperCase(),
            type1: pokemonType,
            type2: pokemonType2,
            img: pokemonImg,
            desc: pokemonDescription,
            species: pokemonSpecies
        };
    } catch (error) {
        console.error('Error fetching Pokemon data:', error);
        // Display error message on the screen
        displayErrorMessage("NOOOO! Failed to fetch Pokemon data. :'(");
    }
    // console.log(pokedex);
}


function updatePokemon() {
    pokemonimage.src = pokedex[this.id]['img'];
}

input.addEventListener("input", e => {
    let search = e.target.value.toLowerCase();
    let pokemon = document.querySelectorAll('.pokemon-name');

    for (let i = 0; i < pokemon.length; i++) {
        let pokemonName = pokemon[i].innerText.toLowerCase();
        if (pokemonName.includes(search)) {
            pokemon[i].style.display = 'block';
        } else {
            pokemon[i].style.display = 'none';
        }
    }
});

function completeLoading() {
    menu.style.display = 'inline-block';
    pokemoncard.style.display = 'inline-block';
    loading.style.opacity = 0;
    loadingdata.style.opacity = 0;
    loadingdata2.style.opacity = 0;
    setTimeout(() => {
        menu.style.opacity = 1;
        loadingdata.style.display = 'none';
        loadingdata2.style.display = 'none';
        loading.style.display = 'none';
    }, 1000);
    completedLoading = true;
}

toggle.addEventListener('click', function() {
    if (!light) {
        document.body.style.background = "url('IMG_5524.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundAttachment = "fixed";

        headerframe.style.background = "black";
        description.style.background = "black";
        headerframe.style.color = "white";
        description.style.color = "white";
        loadingdata.style.color = "white";
        loadingdata2.style.color = "white";
        toggleimg.style.filter = "invert(100%)";

        light = true;
    } else {
        document.body.style.background = "url('IMG_5523.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundAttachment = "fixed";

        headerframe.style.background = "white";
        description.style.background = "white";
        headerframe.style.color = "#4E5A51";
        description.style.color = "#4E5A51";
        loadingdata.style.color = "black";
        loadingdata2.style.color = "black";
        toggleimg.style.filter = "invert(0%)";

        light = false;
    }
});

setInterval(() => {
    if (completedLoading) {
        if (window.innerWidth <= 500) {
            cardheader.style.fontSize = '8px';
            input.style.fontSize = '8px';
            for (let i = 0; i <= pokemonCount; i++) {
                document.querySelectorAll(`.pokemon-name`)[i].style.fontSize = '8px';
            }
            toggle.style.top = '3%';
        }
    }
}, 100);

function displayErrorMessage(str) {
    loadingdata.style.color = "red";
    loadingdata.innerText = str;
}