let revealCounter = 0
let bombPositions = []
let rows = 0
let columns = 0
let numOfBombs = 0
let totalGrids = 0

// Runs Minesweeper
difficultySelection()

function createMinefield(rowsInput, columnsInput, numOfBombsInput) {
    rows = rowsInput
    columns = columnsInput
    totalGrids = rows * columns
    revealCounter = 0
    numOfBombs = numOfBombsInput
    bombPositions = randomizeBombs(totalGrids, numOfBombs)
    
    const minefield = document.getElementById('minefield')
    minefield.innerHTML = ''
    minefield.style.gridTemplateRows = `repeat(${rows}, 1fr)`
    minefield.style.gridTemplateColumns = `repeat(${columns}, 1fr)`

    for (let index = 0; index < totalGrids; index++) {
        const gridButton = document.createElement('button')
        gridButton.classList.add('grid-button')
        gridButton.setAttribute('data-index', index)

        const bombCount = checkAdjacentBombs(index)
        // Left-Click = Pressing Grid Buttons
        gridButton.addEventListener('click', () => {
            if (!bombPositions.includes(index)) safeGridHandler(gridButton, bombCount, index)
            else bombHandler(bombPositions)
        });
        // Right-Click = Flagging Bombs
        gridButton.addEventListener('contextmenu', flagHandler)

        minefield.appendChild(gridButton)
    }
}

// Handles When Pressing A Safe Grid-Button
function safeGridHandler(gridButton, numAdjacentBombs, index) {
    // if (gridButton.disabled) return

    gridButton.style.backgroundColor = '#384b70'
    gridButton.disabled = true
    gridButton.textContent = ''

    revealCounter++;

    if (numAdjacentBombs != 0) gridButton.textContent = numAdjacentBombs;
    else revealAdjacentEmptyGrids(index)

    checkWin();
}

// Reveals Nearby Empty Grids
function revealAdjacentEmptyGrids(index) {
    const topBorder = index < columns
    const leftBorder = index % columns === 0
    const rightBorder = (index + 1) % columns === 0
    const bottomBorder = index >= (rows * columns) - columns

    const adjacentIndices = []

    if (!topBorder) adjacentIndices.push(index - columns)
    if (!leftBorder) adjacentIndices.push(index - 1)
    if (!rightBorder) adjacentIndices.push(index + 1)
    if (!bottomBorder) adjacentIndices.push(index + columns)
    if (!topBorder && !leftBorder) adjacentIndices.push(index - columns - 1)
    if (!topBorder && !rightBorder) adjacentIndices.push(index - columns + 1)
    if (!bottomBorder && !leftBorder) adjacentIndices.push(index + columns - 1)
    if (!bottomBorder && !rightBorder) adjacentIndices.push(index + columns + 1)

    adjacentIndices.forEach(i => {
        const gridButton = document.querySelector(`.grid-button[data-index='${i}']`)
        if (!gridButton.disabled) {
            const bombCount = checkAdjacentBombs(i)
            safeGridHandler(gridButton, bombCount, i)
        }
    });
}

// Checking & Counting Bombs Close
function checkAdjacentBombs(index) {
    const topBorder = index < columns
    const leftBorder = index % columns === 0
    const rightBorder = (index + 1) % columns === 0
    const bottomBorder = index >= (rows * columns) - columns

    let bombCount = 0

    if (!topBorder && bombPositions.includes(index - columns)) bombCount++
    if (!leftBorder && bombPositions.includes(index - 1)) bombCount++
    if (!rightBorder && bombPositions.includes(index + 1)) bombCount++
    if (!bottomBorder && bombPositions.includes(index + columns)) bombCount++
    if (!topBorder && !leftBorder && bombPositions.includes(index - columns - 1)) bombCount++
    if (!topBorder && !rightBorder && bombPositions.includes(index - columns + 1)) bombCount++
    if (!bottomBorder && !leftBorder && bombPositions.includes(index + columns - 1)) bombCount++
    if (!bottomBorder && !rightBorder && bombPositions.includes(index + columns + 1)) bombCount++

    return bombCount;
}

// Handles When Pressing A Bomb Grid-Button
function bombHandler(bombPositions) {
    revealBombs(bombPositions)
    disableGridButtons()
    setTimeout(() => {
        alert('BOOOOOOOOOOOOOOM')
    }, 500)
}

// Handles Right-Clicking A Button
function flagHandler(event) {
    event.preventDefault()
    const gridButton = event.target
    if (!gridButton.disabled) {
        if (gridButton.textContent === '') gridButton.textContent = '🚩'
        else if (gridButton.textContent === '🚩') gridButton.textContent = ''
    }
}

// Reveals All Bombs After Explosion
function revealBombs(bombPositions) {
    bombPositions.forEach(bombIndex => {
        const gridButton = document.querySelector(`.grid-button[data-index='${bombIndex}']`)
        gridButton.style.backgroundColor = '#903839'
        gridButton.textContent = '💥'
    });
}

// Select Difficulty & Start Game
function difficultySelection() {
    const difficultyButtons = document.querySelectorAll('.difficulty-button')
    difficultyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const difficultySelected = event.target.textContent

            if (difficultySelected === 'EASY') createMinefield(9, 9, 10)
            else if (difficultySelected === 'MEDIUM') createMinefield(16, 16, 40)
            else createMinefield(16, 30, 99)
        })
        button.addEventListener('contextmenu', (event) => {
            event.preventDefault()
        })
    })
}

// Randomize Buttons For Mine Grid
function randomizeBombs(totalRowsAndColumns, numOfBombs) {
    const bombPositions = []

    while (bombPositions.length < numOfBombs) {
        const randomBombPosition = Math.floor(Math.random() * totalRowsAndColumns)
        if (!bombPositions.includes(randomBombPosition)) bombPositions.push(randomBombPosition)
    }
    console.log(bombPositions)

    return bombPositions
}

// Checks If All Safe Cells Are Revealed
function checkWin() {
    const totalCells = rows * columns
    const totalSafeCells = totalCells - numOfBombs

    console.log(`Revealed: ${revealCounter}, Total Safe Cells: ${totalSafeCells}`)

    if (revealCounter === totalSafeCells) {
        disableGridButtons()
        alert('You Win!')
    }
}

// Disables All Grid Buttons On Bomb Press
function disableGridButtons() {
    const gridButtons = document.querySelectorAll('.grid-button')
    gridButtons.forEach(button => {
        button.disabled = true
    })
}
