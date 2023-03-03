let selector;
const mt = [];
const minesPlaced = [];
const pixels = 27;
const theGame = document.getElementById('theGame');
const flags = document.getElementById('flags');
const header = document.getElementById('header');
const resetButton = document.getElementById('resetButton');
let numberOfFlags;

function startGame() {
    selector = document.getElementById("selector").value;
    theGame.addEventListener('click', onclick);
    theGame.addEventListener('contextmenu', onRightClick);
    generateBoard();
    generateBombs();
    startTimer();
    header.removeAttribute('hidden');
    numberOfFlags = selector;
    flags.textContent = "🚩 : " + numberOfFlags;
}

let seconds = 0;
let timerInterval = null;

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    const hours = Math.floor(seconds / 3600) % 10;
    const minutes = Math.floor(seconds / 60) % 60; 
    const remainderSeconds = seconds % 60;
    document.getElementById('timer').textContent = `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function generateBoard() {
    theGame.style.width = `${selector * pixels}px`;
    theGame.style.height = `${selector * pixels}px`;
    document.getElementById('firstPage').style.display = 'none';
    mt.length = 0;
    for (let i = 0; i < selector; ++i) {
        mt.push(Array(selector));
        for (let j = 0; j < selector; ++j) {
            let div = document.createElement('div');
            div.style.top = `${i*pixels}px`;
            div.style.left = `${j*pixels}px`;
            mt[i][j] = div;
            theGame.appendChild(div);
        }
    }
}

function generateBombs() {
    let element;
    let mine;
    for (let i = 0; i < selector; ++i) {
        do {
            let mine = Math.floor(Math.random() * selector * selector);
            element = theGame.children[mine];
        } while (element.value)
        element.value = 'b';
        //element.textContent = "X";
        minesPlaced.push(element);
    }
    generateNeighbours();
}

function generateNeighbours() {
    let totalElements = selector * selector;
    let values = [];
    for (let i = 0; i < selector; ++i) {
        for (let j = 0; j < selector; ++j) {
            let val = mt[i][j].value;
            if (val != "b") {
                let count = 0;
                for (let x = -1; x <= 1; ++x) {
                    for (let y = -1; y <= 1; ++y) {
                        if (i + x >= 0 && i + x < selector && j + y >= 0 && j + y < selector && mt[i + x][j + y].value === "b") {
                            ++count;
                        }
                    }
                }
                if (count > 0) {
                    mt[i][j].value = count;
                    if (count == 1) {
                        mt[i][j].classList.add('one');
                    } else if (count == 2) {
                        mt[i][j].classList.add('two');
                    } else if (count == 3) {
                        mt[i][j].classList.add('three');
                    } else {
                        mt[i][j].classList.add('four');
                    }
                    //mt[i][j].textContent = count;
                }
            }
        }
    }
}

function onclick(e) {
    let tg = e.target.closest('div');
    if (tg.value == "b") {
        alert("You lost");
        for (let i = 0; i < selector; ++i) {
            minesPlaced[i].textContent = "💣";
        }
        stopTimer();
    } else if (tg.value) {
        tg.textContent = tg.value;
        tg.classList.add('show');
    } else {
        tg.classList.add('show');
        showEmptyCells(tg);
    }
}

function onRightClick(e) {
    e.preventDefault();
    let tg = e.target.closest('div');
    if (tg.textContent == "") {
        tg.textContent = "🚩";
        --numberOfFlags;
        flags.textContent = "🚩 : " + numberOfFlags;
    } else if (tg.textContent == "🚩") {
        tg.textContent = "";
        ++numberOfFlags;
        flags.textContent = "🚩 : " + numberOfFlags;
    }  
    if (minesPlaced.every(x=>x.textContent == "🚩")) {
        alert("You win!");
        stopTimer();
    }
}

function showEmptyCells(cell) {
    let row = parseInt(cell.style.top) / pixels;
    let col = parseInt(cell.style.left) / pixels;
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < selector && j >= 0 && j < selector && !mt[i][j].classList.contains('show')) {
            if (!mt[i][j].value && !mt[i][j].classList.contains('mine')) {
                mt[i][j].classList.add('show');
                showEmptyCells(mt[i][j]);
            }
            else if (mt[i][j].value && !mt[i][j].classList.contains('mine')) {
                mt[i][j].classList.add('show');
                mt[i][j].textContent = mt[i][j].value;
            }
            }
        }
    }
}
