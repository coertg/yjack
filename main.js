const {url} = require('./src/command-line-args')
const fetchInput = require('./src/fetch-input')
const aWinsGame = require('./src/player-a-wins')

fetchInput(url).then(games => {
  //console.log(url, hands)

  const results = games.map(game => {
    try {
      const result = aWinsGame(game.playerA, game.playerB)
      return {...game, calculatedPlayerAWins: result, isCorrect: result === game.playerAWins}
    } catch (e){
      console.log('got error', e.message, game)
      return {...game, error: e.message, isCorrect: false}
    }
  })
  const failures = results.filter(r => r.playerAWins != r.calculatedPlayerAWins)
  console.log(`${failures.length}/${games.length} incorrect`)
  console.table(results, ['playerA', 'playerB', 'playerAWins', 'calculatedPlayerAWins', 'isCorrect'])
})