import ServiceServer from '../src/server'
import ServiceClient from '../src/client'

import { expect } from 'chai' 

describe('server', function() {
  it('should create the server', function() {
    let server = new ServiceServer()
  })
})

describe('client', function() {

  it('should create a client', function() {
    new ServiceClient('ws://localhost')
  })

  let client = new ServiceClient()
  client.connection.ws.on('open', async () => {

    it('should add a service to get the sum', function() {
      client.add('sum', ([a, b]) => {
        return a + b
      })
    })

    it('should use the service and eq 3', async function() {
      let res = await client.call('sum', 1, 2)
      expect(res).to.equal(3)
    })
  })
})

