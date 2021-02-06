
// Here we just define the what command line arguments required, as well as parsing them from the command line

const optionDefinitions = [
  {
    name: 'url',
    description: 'The URL used to fetch input data for this application',
    type: String
  }
]
module.exports = require('command-line-args')(optionDefinitions)