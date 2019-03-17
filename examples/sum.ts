import ServiceServer from '../src/server'
import ServiceClient from '../src/client'

// creates the server with default settings
let server = new ServiceServer()

// creates the client with default settings
let client = new ServiceClient()

// wait for the connection to open before adding anything
client.connection.ws.on('open', async () => {

  // add the sum function to the server
  client.add('sum', ([a, b]) => {
    return a + b
  })

  // call the sum function from the server
  let res = await client.call('sum', 1, 2)

  // the result should be 3
  console.assert(res === 3)
})
