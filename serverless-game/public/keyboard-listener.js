export default function createKeyboardListener(document) {
  const state ={
    observers: [],
    playerId: null
  }

  function registerPlayerId(playerId) {
    state.playerId = playerId
  }

  function subscribe(observerFunction) {
    state.observers.push(observerFunction)
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
    for (const observerFunction of state.observers) {
      observerFunction(command)
    }
  }

  document.addEventListener('keydown', handleKeyDown)

  function handleKeyDown(event) {
    const keyPressed = event.key

    const command = {
      type: 'move-player',
      playerId: state.playerId,
      keyPressed
    }

    notifyAll(command)
  }

  return {
    registerPlayerId,
    subscribe,
    unsubscribe,
    unsubscribeAll
  }
}
