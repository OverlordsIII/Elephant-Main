const tags = ["personal", "community", "shared"];

const Card = function(term){
    this.term = term;
    this.definitions = [];

    this.addDefinition = function(definition){
        this.definitions.push(definition)
    }
}

const Deck = function(name){
    this.name = name;
    this.cards = [];
    this.author = "Unauthored";
    this.favoritesNumber = 0;
    this.lastModified = new Date();
    this.creationDate;

    this.addCard = function(card){
        this.cards.push(card);
    }
}

//sortIndex
//0 = Recently Viewed
//1 = Favorited + Alphabetical
//2 = Alphabetical

//viewIndex
//0 = All Decks
//1 = Your Decks
async function displayFlashcard(name, author, type, deckID, favorite, search){
    let mainDiv = document.createElement('div');

    let iconDiv = document.createElement('div');
    let icon = document.createElement('img');

    if(type === "PRIVATE") type = "PERSONAL";
    else if(type === "PUBLIC") type = "COMMUNITY"

    icon.src = "../icons/file.png";
    iconDiv.appendChild(icon);
    iconDiv.classList.add(type.toLowerCase() + "-flashcard");

    let textDiv = document.createElement('div');
    let nameText = document.createElement('h1');
    let authorDiv = document.createElement('div');
    let authorImg = document.createElement('img');
    let authorText = document.createElement('p');

    let testSpace = document.getElementById('flashcards-display-test');
    for(let i = 0; i < name.length; i++){
        testSpace.innerHTML = name.substring(0, i);
        if(testSpace.clientWidth > 190) {
            name = name.substring(0, i - 1) + "...";
            break;
        }
    }

    const response = await fetch('https://elephant-rearend.herokuapp.com/login/user?id=' + author, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    })

    const content = await response.json();

    nameText.innerHTML = name
    authorText.innerHTML = content.context.user.firstName + " " + content.context.user.lastName;
    authorImg.src = "../../icons/avatars/" + content.context.user.pfpId + ".png";
    authorDiv.append(authorImg, authorText);
    textDiv.append(nameText, authorDiv);

    let tag = document.createElement('p');
    tag.innerHTML = type;
    tag.classList.add(type.toLowerCase() + "-flashcard");

    let options = document.createElement('div');
    let favoriteImg = document.createElement('img');
    let editImg = document.createElement('img');
    let deleteImg = document.createElement('img')

    if(favorite){
        favoriteImg.src = "../icons/filled_heart.png";
        favoriteImg.classList.add('loved');
    } else {
        favoriteImg.src = "../icons/unfilled_heart.png";
        favoriteImg.classList.add('unloved');
    }

    editImg.src = "../editor/icons/edit.png";
    deleteImg.src = "../icons/delete.png";

    favoriteImg.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        favoriteDeck(this, deckID)
    })

    editImg.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        editFlashcard(deckID);
    })

    deleteImg.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        deleteDeck(deckID);
    });

    const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
    if(author === savedUserId){
        options.append(editImg, favoriteImg, deleteImg);
    } else {
        options.append(favoriteImg);
    }

    mainDiv.append(iconDiv, textDiv, tag, options);
    mainDiv.classList.add('flashcard-deck');
    mainDiv.classList.add(type.toLowerCase() + "-flashcard-border");
    mainDiv.setAttribute('onclick', "location.href = '../viewer/?deck=" + deckID + "'");

    mainDiv.addEventListener('contextmenu', function(e){
        e.preventDefault();
        e.stopPropagation();

        while (document.getElementById('context-menu').firstChild) {
            document.getElementById('context-menu').firstChild.remove()
        }

        let cmOptions = []

        if(author === savedUserId){
            cmOptions = [
                ["view", "View Deck", "location.href = '../viewer/?deck=" + deckID + "'"],
                ["../editor/icons/edit", "Edit Deck", "editFlashcard(" + deckID + ")"],
                ["delete", "Delete Deck", "deleteDeck(" + deckID + ")"]
            ]
        } else {
            cmOptions = [
                ["view", "View Deck", "location.href = '../viewer/?deck=" + deckID + "'"]
            ]
        }

        contextMenuOptions(cmOptions)
        toggleContextMenu(true, e);
    })

    if(search){
        document.getElementById('search-results-main').appendChild(mainDiv);
    } else {
        document.getElementById('flashcards-list').appendChild(mainDiv);
    }
}

async function deleteDeck(id){
    const response = await fetch('https://elephant-rearend.herokuapp.com/deck/delete?id=' + id, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'Content-Length, X-JSON',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        },
        method: 'DELETE',
        mode: 'cors'
    })

    const context = await response.json();
    console.log(context);

    locateUserInfo();
}

function editFlashcard(id){
    location.href = "../editor/?deck=" + id;
}

async function favoriteDeck(elem, id){
    if(elem.classList.contains('unloved')){
        elem.src = "../icons/filled_heart.png";
        elem.classList.remove('unloved');
        elem.classList.add('loved')

        const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
        const response = await fetch('https://elephant-rearend.herokuapp.com/deck/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                userId: savedUserId,
                deckId: id
            }),
            mode: 'cors'
        })

    } else {
        elem.src = "../icons/unfilled_heart.png";
        elem.classList.add('unloved');
        elem.classList.remove('loved')

        const savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
        const response = await fetch('https://elephant-rearend.herokuapp.com/deck/unlike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                userId: savedUserId,
                deckId: id
            }),
            mode: 'cors'
        })
    }
}

function createFolder(){
    toggleFolderModal(false)
}

function createDeck(){
    togglePageFlip(undefined, undefined, "../editor");
}