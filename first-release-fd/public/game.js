export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 20,
      height: 20
    }
  }

  const observers = []

  function start() {
    const frequency = 2000

    setInterval(addFruit, frequency)
  }

  function subscribe(observerFunction) {
    observers.push(observerFunction)
  }

  function unsubscribe(observerFunction) {
    const observerIndex = observers.indexOf(observerFunction)

    if (observerIndex == -1) return

    observers.splice(observerIndex, 1)
  }

  function unsubscribeAll() {
    observers.length = 0
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command)
    }
  }

  function setState(newState) {
    Object.assign(state, newState)
  }

  function addPlayer(command) {
    const playerId = command.playerId
    const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
    const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

    state.players[playerId] = {
      x: playerX,
      y: playerY,
      points: 0
    }

    notifyAll({
      type: 'add-player',
      playerId,
      playerX,
      playerY,
      points: 0
    })
  }

  function removePlayer({ playerId }) {
    delete state.players[playerId]

    notifyAll({
      type: 'remove-player',
      playerId,
    })
  }

  function addFruit(command) {
    const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000)
    const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
    const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY
    }

    notifyAll({
      type: 'add-fruit',
      fruitId,
      fruitX,
      fruitY
    })
  }

  function removeFruit(fruitId) {
    delete state.fruits[fruitId]

    notifyAll({
      type: 'remove-fruit',
      fruitId
    })
  }

  function movePlayer(command) {
    notifyAll(command)

    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y - 1 >= 0) {
          player.y -= 1
        }
      },
      ArrowRight(player) {
        if (player.x + 1 < state.screen.width) {
          player.x += 1
        }
      },
      ArrowDown(player) {
        if (player.y + 1 < state.screen.height) {
          player.y += 1
        }
      },
      ArrowLeft(player) {
        if (player.x - 1 >= 0) {
          player.x -= 1
        }
      }
    }

    const player = state.players[command.playerId]
    const moveFunction = acceptedMoves[command.keyPressed]

    if (player && moveFunction) {
      moveFunction(player)
      checkForFruitCollision(player)
    }

    function checkForFruitCollision(player) {
      for (const fruitId in state.fruits) {
        const fruit = state.fruits[fruitId]

        if (player.x == fruit.x && player.y == fruit.y) {
          removeFruit(fruitId)
          state.players[command.playerId].points += 1
        }
      }
    }
  }

  return {
    start,
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    movePlayer,
    setState,
    state,
    subscribe,
    unsubscribe,
    unsubscribeAll
  }
}
