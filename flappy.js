function getPlayerPositions() {
    const playerBounds = document.querySelector('.player').getBoundingClientRect()
    return playerBounds
}

function getObstacleBound(element) {
    return element.getBoundingClientRect()
}

function getBoxesBounds() {
    const superiorObstacles = document.querySelectorAll('.obstaculo-superior')
    const inferiorObstacles = document.querySelectorAll('.obstaculo-inferior')
    const obstacles = []
    superiorObstacles.forEach(element => obstacles.push(element))
    inferiorObstacles.forEach(element => obstacles.push(element))
    return obstacles.map(getObstacleBound);
}

function collideLine(x1, x2, y1, y2) {
    return ((x1 <= y1 && x2 >= y1) || (y1 <= x1 && y2 >= x1)) ? true : false
}

function collide(element1, element2) {
    if (element1.left > element2.left) {
        const aux = element1
        element1 = element2
        element2 = aux
    }
    return (element1.right >= element2.left && collideLine(element1.top, element1.bottom, element2.top, element2.bottom)) ? true : false
}

function checkColision() {
    const playerBounds = getPlayerPositions()
    const boxesBounds = getBoxesBounds()
    if(boxesBounds.length === 0) return false
    const answer = boxesBounds.reduce((colision, element) => {
        colision |= collide(playerBounds, element)
        return colision
    }, false)

    return answer !== 0
}

function endFrame() {
    document.querySelector('body').setAttribute('style', 'font-size:12em;');
    document.querySelector('body').innerHTML = "LOOSEEERRR"
}

let points = 0
const inf = 1000000, jump = 6

function getBarriersXBounds() {
    const barriers = document.querySelectorAll('.obstaculo')
    const aBarriers = Array.from(barriers)
    if (aBarriers.length === 0) {
        return {
            l: 0,
            r: 0
        }
    }
    return aBarriers.map(element => {
        const elementBounds = element.getBoundingClientRect()
        return {
            l: elementBounds.left,
            r: elementBounds.right
        }
    })

}

function upgradePoints() {
    const obstacles = getBarriersXBounds()
    const playerPos = getPlayerPositions()
    obstacles.forEach(element => {
        if (element.r < playerPos.left && element.r + jump >= playerPos.left) {
            points++;
        }
    })

}

function upgradePositionBarriers() {
    const barriers = document.querySelectorAll('.obstaculo')
    barriers.forEach((element, index) => {
        const lftMargin = parseInt(element.style['margin-left'])
        element.style = `margin-left:${lftMargin - jump}px;`
    })
}

function upgradePositionPlayer(fjump = jump / 2) {
    const player = document.querySelector('.player')
    let topMargin = parseInt(player.style['margin-top'])
    const height = parseInt(player.style.height)
    const wh = parseInt(document.querySelector('.box-player').offsetHeight)
    if (topMargin + 2 * fjump + height > wh) {
        topMargin = wh - height
    } else {
        topMargin += 2 * fjump
    }
    player.style = `margin-top: ${topMargin}px; height: ${height}px;`
}

function destroyPassedBarriers() {
    const barriers = document.querySelectorAll('.obstaculo')
    barriers.forEach((element, index) => {
        if (element.right < 0) element.outerHTML = ""
    })
}

function getGameScreenWidth() {
    const gameScreen = document.querySelector('[wm-flappy]')
    const gameScreenWidth = gameScreen.offsetWidth
    return gameScreenWidth
}

function getObstacleSizes() {
    const playerHeight = parseInt(document.querySelector('.player').style.height)
    const height = document.querySelector('[wm-flappy]').offsetHeight - (playerHeight * 4)
    const firstHeight = Math.floor(Math.random() * height)
    return {
        top: firstHeight,
        bottom: height - firstHeight - 1
    }
}

function createBarrier() {

    const gameScreenWidth = getGameScreenWidth()
    const toInsert = document.querySelector('[wm-flappy]')
    const objecticleSizes = getObstacleSizes()
    
    let newBarrierCode = '<div class="obstaculo" style="margin-left:'
    newBarrierCode += `${gameScreenWidth}px`
    newBarrierCode += ';"><div class="obstaculo-superior" style="height:'
    newBarrierCode += `${objecticleSizes.top}px`
    newBarrierCode += ';"></div><div class="obstaculo-inferior" style="height:'
    newBarrierCode += `${objecticleSizes.bottom}px`
    newBarrierCode += ';"></div></div>'
    const textToIns = document.createTextNode(newBarrierCode)
    toInsert.innerHTML += newBarrierCode
}

function addBarriers() {
    const obstacles = getBarriersXBounds()
    const gameScreenWidth = getGameScreenWidth()
    let minSpaceBarrierScreen = inf
    obstacles.forEach(element => {
        minSpaceBarrierScreen = Math.min(minSpaceBarrierScreen, gameScreenWidth - element.r)
    })
    if (minSpaceBarrierScreen == inf || minSpaceBarrierScreen > 300) {
        createBarrier()
    }
}

function showPoints() {
    const pointsDiv = document.querySelector('[points]')
    pointsDiv.innerHTML = 'Pontos: ' + `${points}`
}

function renderFrame() {
    if (checkColision()) {
        endFrame()
        return;
    }

    upgradePoints()
    upgradePositionBarriers()
    upgradePositionPlayer()
    destroyPassedBarriers()
    addBarriers()
    showPoints()
    setTimeout(renderFrame, 50)
}

renderFrame()

const aux = document.querySelector('[wm-flappy]')
aux.onclick = _ => {
    upgradePositionPlayer(-20)
}
