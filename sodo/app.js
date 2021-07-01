const grid = document.querySelector('.grid');
const solve = document.querySelector('.solve');
const reset = document.querySelector('.reset');

let width = 9;

const API_FOR_SODUKO_GEN = "https://sugoku.herokuapp.com/board?difficulty=random";

async function getSoduko() {
    const sudo = await fetch(API_FOR_SODUKO_GEN);
    const jsonTosudo = await sudo.json();
    return jsonTosudo;
} 

let board = [];

let boardsNums = [
    [3, 0, 6, 5, 0, 8, 4, 0, 0],
    [5, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 8, 7, 0, 0, 0, 0, 3, 1],
    [0, 0, 3, 0, 1, 0, 0, 8, 0],
    [9, 0, 0, 8, 6, 3, 0, 0, 5],
    [0, 5, 0, 0, 9, 0, 6, 0, 0],
    [1, 3, 0, 0, 0, 0, 2, 5, 0],
    [0, 0, 0, 0, 0, 0, 0, 7, 4],
    [0, 0, 5, 2, 0, 6, 3, 0, 0],
];

let newar = [];
for (let h = 0; h <= 80; h++){
    newar[h] = h;
}


function createBoard() {
    for (let i = 0; i < width*width; i++) {
        const createDiv = document.createElement('div');
        createDiv.setAttribute('id', i);
        grid.appendChild(createDiv);
        board[i] = createDiv;
    }
}
createBoard();



function fillNums() {
    let c = 0;
    let j = 0;
    for (let i = 0; i < width; i++){
        for (let j = 0; j < width; j++){
            board[c].innerText = boardsNums[i][j];
            c++;
        }
        
    }
    
}

fillNums();

function resetBoard(newBoard) {
    console.log("newSife");
    let c = 0;
    for (let i = 0; i < width; i++){
        for (let j = 0; j < width; j++){
            boardsNums[i][j] = newBoard[i][j];
            // c++;
        }
        
    }

    fillNums();
}

function isPossible(i, j, val) {
    for (let row = 0; row < 9; row++) {
        if (boardsNums[row][j] == val) {
            return false;
        }
    }

    for (let col = 0; col < 9; col++) {
        if (boardsNums[i][col] == val) {
            return false;
        }
    }

    let r = i - (i % 3);
    let c = j - (j % 3);

    for (let cr = r; cr < r + 3; cr++) {
        for (let cc = c; cc < c + 3; cc++) {
            if (boardsNums[cr][cc] == val) {
                return false;
            }
        }
    }
    return true;

}

function againHelper(x,i,j){
    if (x > 80 && i > 8) {
        return;
    }
    if (j == 9) {
        againHelper(x, i + 1, 0);
        return;
    }

    setTimeout(() => {
      
        board[x].innerText =  newar[x];
        setTimeout(() => {
            board[x].style.background = "none";
            
            againHelper(x + 1, i, j + 1);
        }, 10);
        board[x].style.background = "red";
    }, 100);
    return;
}

function fillthis() {
    let c = 0;
    for (let i = 0; i < boardsNums.length; i++){
        for (let j = 0; j < boardsNums[0].length; j++){
            newar[c++] = boardsNums[i][j];
        }
    }

}

function solveSudokuHelper(sr, sc) {
    if (sr == 9) {
        fillthis();
        againHelper(0, 0, 0);
        return;
    }
    if (sc == 9) {
        solveSudokuHelper(sr + 1, 0)
        return;
    }

    if (boardsNums[sr][sc] != 0) {
        solveSudokuHelper(sr, sc + 1);
        return;
    }

    for (let i = 1; i <= 9; i++) {
        if (isPossible( sr, sc, i)) {
            boardsNums[sr][sc] = i;
            let ch =  solveSudokuHelper(sr, sc + 1);
            if (ch == true) {
                return true;
            }
        }
    }
    boardsNums[sr][sc] = 0;
    return false;
}

function solveSudoku() {
    solveSudokuHelper( 0, 0)
}

solve.addEventListener('click', () => {
    solveSudoku();
    solve.disabled = true;
});

reset.addEventListener('click', () => {
    let data;
    async function getdata() {
        data = await getSoduko();
        data = data["board"];
        console.log(data);
        for (let i = 0; i < data.length; i++){
            for (let j = 0; j < data[0].length; j++){
                 console.log(data[i][j]);
            }
        }
        resetBoard(data);
    } 

    getdata();
})


