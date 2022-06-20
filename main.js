/////// Constants //////
const GRID = document.getElementsByClassName('grid')[0];
const NUMBER_OF_TURNS = document.getElementById('number-of-turns');
const START_BTN = document.getElementById('start');
const REFRESH_BTN = document.getElementById('refresh');
const STOP_BTN = document.getElementById('stop');
const GRID_WIDTH = 50;
const GRID_HEIGHT = 25;
const INTERVAL_DELAY = 100;

// Initialize the grid of cells
let cells = [...Array(GRID_WIDTH * GRID_HEIGHT)];
let numberOfTurns = 0;
initializeGrid(cells);

//////// Event Listener /////////
// Toggle a cell status
GRID.addEventListener('click', (e) => {
    let id = e.target.id;
    cells = toggleCellStatus(cells, id);
});

// Start the game
let interval = null;
START_BTN.addEventListener('click', (e) => {
    e.preventDefault();
    interval = setInterval(() => {
        cells = evaluateCells(cells);
        numberOfTurns++;
        NUMBER_OF_TURNS.innerText = numberOfTurns;
    }, INTERVAL_DELAY);
});

// Stop the game
STOP_BTN.addEventListener('click', (e) => {
    e.preventDefault();
    clearInterval(interval);
});

// Refresh the game
REFRESH_BTN.addEventListener('click', (e) => {
    e.preventDefault();
    cells = refreshGrid(cells);
    clearInterval(interval);
});


////// Functions /////
function initializeGrid(cells) {
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            cells[row * GRID_WIDTH + col] = false;
            let cellElement = document.createElement('div');
            cellElement.classList.add('cell', 'cell--dead');
            cellElement.setAttribute('id', row * GRID_WIDTH + col)
            GRID.appendChild(cellElement);
        }
    }
}

function toggleCellStatus(cells, id) {
    cells[id] = !cells[id];
    updateCellClassList(cells, id);
    return cells;
}

function updateCellClassList(cells, id) {
    if (cells[id] === true) {
        document.getElementById(id).classList.remove('cell--dead');
        document.getElementById(id).classList.add('cell--alive');
    } else {
        document.getElementById(id).classList.remove('cell--alive');
        document.getElementById(id).classList.add('cell--dead');
    }
}

function evaluateCells(cells) {
    let newGrid = [];
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            let livingCellNeighbours = getNeighbours(cells, row, col).filter(c => c === true);
            if (cells[row * GRID_WIDTH + col] === true) {
                if (livingCellNeighbours.length === 2 || livingCellNeighbours.length == 3) {
                    newGrid.push(true);
                } else {
                    newGrid.push(false);
                }
            } else {
                if (livingCellNeighbours.length === 3) {
                    newGrid.push(true);
                } else {
                    newGrid.push(false);
                }
            }
        }
    }
    cells = newGrid;
    for (let index = 0; index < cells.length; index++) {
        updateCellClassList(cells, index);
    }
    return cells;
}

function getNeighbours(cells, row, col) {
    let neighbours = [];
    let neighbourRow;
    let neighbourCol;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            neighbourRow = row + i;
            neighbourCol = col + j;
            if (isPositionValid(neighbourRow, neighbourCol) && (i !== 0 || j !== 0)) {
                neighbours.push(cells[neighbourRow * GRID_WIDTH + neighbourCol]);
            }
        }
    }
    console.log(neighbours);
    return neighbours;
}

function isPositionValid(row, col) {
    return (row >= 0 && row < GRID_HEIGHT && col >= 0 && col < GRID_WIDTH);
}

function refreshGrid(cells) {
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            let index = row * GRID_WIDTH + col;
            cells[row * GRID_WIDTH + col] = false;
            document.getElementById(index).classList.remove('cell--alive');
            document.getElementById(index).classList.add('cell--dead');
            numberOfTurns = 0;
            NUMBER_OF_TURNS.innerText = numberOfTurns;
        }
    }
    return cells;
}