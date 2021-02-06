const desiredScore = 21

let numericRankValues = {}
for(let i = 2; i <= 9; i++)
  numericRankValues[i] = i

const rankValueLookup = {
  ...numericRankValues,
  '10': 10,
  'J': 10,
  'K': 10,
  'Q': 10,
  'A': 11
}
const suitHierarchy = ['D', 'C', 'H', 'S'] // higher index beats lower index

const parseCardString = cardString => {
  const [rank, suit] = cardString.length < 3 ? cardString.split('') : [10, cardString[cardString.length-1]]
  return {
    rank,
    rankValue: rankValueLookup[rank],
    suit
  }
}

const getHandScoreAnalysis = hand => {
  const score = hand.reduce((acc, {rankValue}) => acc + rankValue, 0)
  return {
    score, 
    scoreCanWin: score <= desiredScore
  }
}

const firstHandBreaksTie = (first, second) => {
  let winnerFound = false
  let firstHandIsWinner
  let defaultCard = {score: 0}
  let requiredComparisons = Math.max(first.length, second.length)

  // Assumption: if one player has more cards than the other, and we reach a point 
  // where only one player has cards left for comparison, the player with more cards is going to win
  for(let i = 0; i < requiredComparisons && !winnerFound; i++){ // Compare cards in order of rank first
    let firstCard = first[i] || defaultCard
    let secondCard = second[i] || defaultCard
    winnerFound = firstCard.score !== secondCard.score
    if(winnerFound)
      firstHandIsWinner = firstCard.score > secondCard.score
  }

  if(!winnerFound){ // If hands are identical in terms of rank, then we check the suit of the highest card
    let firstSuitIndex = suitHierarchy.indexOf(first[0].suit)
    let secondSuitIndex = suitHierarchy.indexOf(second[0].suit)

    if(firstSuitIndex !== secondSuitIndex)
      firstHandIsWinner = firstSuitIndex > secondSuitIndex
    else 
      console.warn('Tie could not be broken')
  }
  return firstHandIsWinner
}

// Doing a naive sort for now, v8 uses insertion sort for short arrays, and quicksort for long arrays
const sortByRankScore = hand => hand.sort((a, b) => b.score - a.score)

// This function returns true when player A wins
module.exports = (handA, handB) => {
  const parsedHandA = handA.map(parseCardString)
  const parsedHandB = handB.map(parseCardString)

  const rankScoreA = getHandScoreAnalysis(parsedHandA)
  const rankScoreB = getHandScoreAnalysis(parsedHandB)

  if(rankScoreA.scoreCanWin && rankScoreB.scoreCanWin){ // First check that both scores are lte the desired score
    if(rankScoreA.score === rankScoreB.score){ // Next, check for a tie
      
      // We need to compare the most valuable card, so at this point we need to sort 
      const sortedHandA = sortByRankScore(parsedHandA)
      const sortedHandB = sortByRankScore(parsedHandB)

      return firstHandBreaksTie(sortedHandA, sortedHandB)

    } else return rankScoreA.score > rankScoreB.score // This is not a tie, so the higher score wins
  } else return rankScoreA.scoreCanWin // Only one player wins, so we return A's result
}