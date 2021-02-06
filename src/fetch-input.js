const fetch = require('node-fetch')

const requestError = status => new Error(`Request for input data failed with status code ${status}`)

module.exports = async url => {
  const httpResponse = await fetch(url)
  if (httpResponse.ok){
    const json = await httpResponse.json()
    return json
  } else throw requestError(httpResponse.status)
}