let deck;
let termActiveSlide = true;
let activeFlashcardCard = 0;

function togglePageFlip(index, sidebar, link){

    const pages = ["Deck Carousel", "Deck Memorize", "Deck Review", "Deck Statistics", "Deck Cards"];

    if(link){
        window.location.href = link;
        return;
    }

    document.getElementById('desktop-main-container-tab').innerHTML = pages[index];
    try{document.querySelector(".active-sidebar-category").classList.remove('active-sidebar-category')} catch{}

    if(!(sidebar === undefined)){
        if(sidebar >= document.querySelectorAll('.desktop-sidebar-category').length){
            document.querySelectorAll('.desktop-sidebar-folder')[sidebar - document.querySelectorAll('.desktop-sidebar-category').length].classList.add('active-sidebar-category')
        } else {
            document.querySelectorAll('.desktop-sidebar-category')[sidebar].classList.add('active-sidebar-category')
        }
    }

    try{document.querySelectorAll('.desktop-sidebar-category')[sidebar].classList.add('active-sidebar-category')} catch{}
    try {document.querySelector(".active-tab").classList.remove('active-tab')} catch{}
    document.querySelectorAll('.desktop-tab')[index].classList.add('active-tab')

    const removeBottomBtns = [1, 2, 3, 4, 5, 6, 7]

    if(removeBottomBtns.includes(index)){
        document.querySelectorAll('.desktop-bottom-btn').forEach(function(item){
            item.classList.add('inactive-modal')
        })
    } else {
        try {
            document.querySelectorAll('.desktop-bottom-btn').forEach(function(item){
                item.classList.remove('inactive-modal')
            })
        } catch{}
    }
}

async function addToBackpack(cardId){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    const response = await fetch('https://elephant-rearend.herokuapp.com/backpack/addCard', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS, PUT',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            userId: savedUserId,
            cardId: cardId
        }),
        mode: 'cors'
    });

    const context = await response.json();
    console.log(context, cardId);
}

function createCard(term, definitions, cardId){
    let newDiv = document.createElement('div');
    let newNumber = document.createElement('p');
    let copyrightDiv = document.createElement('div');
    let cardTitle = document.createElement('input');
    let definitionsDiv = document.createElement('div');
    let footerDiv = document.createElement('div');

    newNumber.innerHTML = (document.querySelectorAll('.flashcards-card').length + 1).toString();
    newNumber.classList.add('flashcards-card-number');

    let copyrightElephant = document.createElement('img');
    let copyrightTextDiv = document.createElement('div');
    let copyrightText = document.createElement('p');
    let copyrightImg = document.createElement('img');

    copyrightElephant.src = "../../icons/elephant-400-400-black.png";
    copyrightText.innerHTML = "Elephant";
    copyrightImg.src = "../editor/icons/copyright.png";
    copyrightTextDiv.append(copyrightText, copyrightImg);

    copyrightDiv.append(copyrightElephant, copyrightTextDiv);
    copyrightDiv.classList.add('flashcards-card-copyright');

    cardTitle.placeholder = "New Flashcard";
    cardTitle.setAttribute('readonly', 'true');

    if(term !== undefined) cardTitle.value = term;

    cardTitle.id = "flashcards-input-" + (document.querySelectorAll('.flashcards-card').length + 1).toString();

    if(definitions === undefined){
        let answersDiv = document.createElement('div');
        let definitionsInput = document.createElement('input');

        definitionsInput.placeholder = "Definition";
        definitionsInput.classList.add('flashcards-definition-input');
        definitionsInput.classList.add('flashcards-definition-input-' + (document.querySelectorAll('.flashcards-card').length + 1).toString());
        definitionsInput.setAttribute('readonly', 'true');

        answersDiv.append(definitionsInput);
        answersDiv.classList.add('flashcards-card-answers-div');

        definitionsDiv.appendChild(answersDiv);
    } else {
        for(let i = 0; i < definitions.length; i++){
            let answersDiv = document.createElement('div');
            let definitionsInput = document.createElement('input');

            definitionsInput.placeholder = "Definition";
            definitionsInput.value = definitions[i];
            definitionsInput.classList.add('flashcards-definition-input');
            definitionsInput.classList.add('flashcards-definition-input-' + (document.querySelectorAll('.flashcards-card').length + 1).toString());
            definitionsInput.setAttribute('readonly', 'true');

            answersDiv.append(definitionsInput);
            answersDiv.classList.add('flashcards-card-answers-div');

            definitionsDiv.appendChild(answersDiv);
        }
    }

    definitionsDiv.classList.add('flashcards-card-answers')
    definitionsDiv.id = 'flashcards-card-answers-' + (document.querySelectorAll('.flashcards-card').length + 1).toString();

    let footerRight = document.createElement('div');
    let backpackImg = document.createElement('img');

    backpackImg.src = "../editor/icons/pack.png";
    backpackImg.setAttribute("onclick", "addToBackpack(" + cardId + ")");

    footerRight.classList.add('flashcards-card-footer-right')
    footerRight.append(backpackImg);

    footerDiv.appendChild(footerRight);
    footerDiv.classList.add('flashcards-card-footer');

    newDiv.append(newNumber, copyrightDiv, cardTitle, definitionsDiv, footerDiv);
    newDiv.classList.add('flashcards-card');

    document.getElementById('flashcards-list').appendChild(newDiv);
}

function updateCardsList(){
    console.log(deck);
    for(let i = 0; i < deck.length; i++){
        createCard(deck[i].term, deck[i].definitions, deck[i].id);
    }
}

window.onload = async function(){
    let deckInt = false;

    try{
        deckInt = document.location.href.split("?")[1].includes("deck=");
    } catch(e){
        location.href = "./?deck=0";
    }

    console.log(document.location.href.split("=")[1] === "0")

    if(document.location.href.split("=")[1] === "0"){
        deck = [
            {
                term: "How many colors are there in a rainbow?",
                definitions: ["7"]
            }, {
                term: "What fruit do raisins come from?",
                definitions: ["grape"]
            }, {
                term: "What does a thermometer measure?",
                definitions: ["temperature"]
            }, {
                term: "What are the primary colors?",
                definitions: ["red", "blue", "yellow"]
            }, {
                term: "How many cents are in a quarter?",
                definitions: ["25"]
            }, {
                term: "What are the names of the first 10 numbers?",
                definitions: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
            }, {
                term: "Who Painted the Mona Lisa?",
                definitions: ["leonardo da vinci"]
            }, {
                term: "What does the NBA stand for?",
                definitions: ["national basketball association"]
            }, {
                term: "What's the closest planet to the sun?",
                definitions: ["mercury"]
            }, {
                term: "What is the name of the largest youtube channel?",
                definitions: ["t-series"]
            }, {
                term: "What is the name of the oldest instrument?",
                definitions: ["flute"]
            }
        ];

        document.getElementById('title').innerHTML = "Trivia | Elephant - The Ultimate Student Suite"
        updateCardsList();
        updateFlashcard();
        initializeMemorize();
        return;
    }

    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));

    const response = await fetch('https://elephant-rearend.herokuapp.com/deck/get?id=' + document.location.href.split("=")[1], {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    });

    const context = await response.json();
    console.log(context);

    if(savedUserId !== context.context.deck.authorId && !context.context.deck.sharedUsers.includes(savedUserId) && context.context.deck.visibility !== "PUBLIC") {
        location.href = "../dashboard";
        return;
    }

    for(let i = 0; i < context.context.deck.name.length; i++){
        document.getElementById("desktop-sidebar-deck-name").innerHTML = context.context.deck.name.substring(0, i);
        if(document.getElementById("desktop-sidebar-deck-name").clientWidth > 160) {
            document.getElementById("desktop-sidebar-deck-name").innerHTML = context.context.deck.name.substring(0, i - 1) + "...";
            break;
        }
    }

    if(context.context.deck.visibility === "PUBLIC") document.getElementById('desktop-sidebar-deck-type').classList.add('community');
    else if(context.context.deck.visibility === "SHARED") document.getElementById('desktop-sidebar-deck-type').classList.add('shared');
    else if(context.context.deck.visibility === "PRIVATE") document.getElementById('desktop-sidebar-deck-type').classList.add('personal');

    const recentDeckResponse = await fetch('https://elephant-rearend.herokuapp.com/statistics/recentlyViewedDecks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            userId: savedUserId,
            deckId: context.context.deck.id
        }),
        mode: 'cors'
    });

    const userResponse = await fetch('https://elephant-rearend.herokuapp.com/login/user?id=' + context.context.deck.authorId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    const userContext = await userResponse.json()

    document.getElementById('desktop-sidebar-deck-author-img').src = "../../icons/avatars/" + userContext.context.user.pfpId + ".png"
    document.getElementById('desktop-sidebar-deck-author').innerHTML = userContext.context.user.firstName + " " + userContext.context.user.lastName
    document.getElementById('title').innerHTML = context.context.deck.name + " | Elephant - The Ultimate Student Suite";
    document.getElementById('desktop-review-deck-name').innerHTML = "Test Deck: " + context.context.deck.name;

    deck = context.context.deck.cards;

    updateCardsList();
    updateFlashcard();
    initializeMemorize();
}

function initialize(user){
    if(user.status === "FAILURE") {
        location.href = "../../../login"
    } else user = user.context.user;

    document.getElementById('desktop-navbar-profile-image').src = "../../icons/avatars/" + user.pfpId + ".png";
    document.getElementById('desktop-navbar-profile-name').innerHTML = user.firstName + " " + user.lastName;
    document.getElementById('desktop-navbar-profile-type').innerHTML = "Elephant " + user.type.charAt(0).toUpperCase() + user.type.substr(1).toLowerCase();

    togglePageFlip(0, 0);
}

async function locateUserInfo(){
    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
    const response = await fetch('https://elephant-rearend.herokuapp.com/login/user?id=' + savedUserId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    const context = await response.json();
    console.log(context);
    initialize(context)
}

locateUserInfo()