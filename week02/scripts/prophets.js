const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
        //create elements to add to the div.cards element
        let card = document.createElement('section');
        let fullName = document.createElement('h2');
        let portrait = document.createElement('img');
        let birthDate = document.createElement('p');
        let birthPlace = document.createElement('p');

        //Build the h2 content out to show the prophet's full name
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;
        //Build the image portrait by setting all the relevant attributes
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portait of ${prophet.name} ${prophet.lastname}`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');

        //Add birth date and place
        birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;
        birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;

        //Append the section(card) with the created elements
        card.appendChild(fullName);
        card.appendChild(portrait);
        card.appendChild(birthDate);
        card.appendChild(birthPlace);

        cards.appendChild(card);
    });
}

const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');
async function getProphetData() {
    const response = await fetch(url);
    const data = await response.json();
    displayProphets(data.prophets);
}
getProphetData();
