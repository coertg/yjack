const {url} = require('./src/command-line-args')
const fetchInput = require('./src/fetch-input')

fetchInput(url).then(result => {
  console.log(url, result)
})