export default function renderScreen(screen, leaderBoard, game, requestAnimationFrame, currentPlayerId) {
  const context = screen.getContext('2d')
  context.fillStyle = 'white'
  context.clearRect(0, 0, 20, 20)

  for (const playerId in game.state.players) {
    const player = game.state.players[playerId]
    context.fillStyle = 'black'
    context.fillRect(player.x, player.y, 1, 1)
  }

  for (const fruitId in game.state.fruits) {
    const fruit = game.state.fruits[fruitId]
    context.fillStyle = 'green'
    context.fillRect(fruit.x, fruit.y, 1, 1)
  }

  const currentPlayer = game.state.players[currentPlayerId]

  if (currentPlayer) {
    context.fillStyle = '#F0DB4F'
    context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
  }

  renderLeaderBoard(leaderBoard, game, currentPlayerId)

  requestAnimationFrame(() => {
    renderScreen(screen, leaderBoard, game, requestAnimationFrame, currentPlayerId)
  })
}

function renderLeaderBoard(leaderBoard, game, currentPlayerId) {
  let leaderBoardHtml = `
    <tr>
      <td>Jogadores</td>
      <td>Pontos</td>
    </tr>
  `
  const players = []

  for (const playerId in game.state.players) {
    players.push({
      playerId,
      points: game.state.players[playerId].points
    })
  }

  leaderBoardHtml = players.reduce((stringFormed, player) => {
    return stringFormed + `
      <tr ${player.playerId === currentPlayerId ? 'class="current-player"' : ''}>
        <td>${player.playerId}</td>
        <td>${player.points}</td>
      </tr>
    `
  }, leaderBoardHtml)

  leaderBoard.innerHTML = leaderBoardHtml
}
