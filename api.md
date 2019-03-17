## service

```
add(name: string, args: Arguments, cb: () => any)

events {
  call(name, args)
}
```

## client

```
call(name, args: Arguments): typeof return server[name](args)
call<U, T>(name, args: T[])
```

## server

```
this.services
events {
  add(name: string, args: Arguments):
    ws => ServerResponse

  call(name: string in this.services, args: Arguments):
    ws => ServerResponse
}
```

### Example

```js
// service creates and adds "add" microservice to server and self
service.add(
  'add',
  {
    a: {
      type: 'int'
    },
    b: {
      type: 'int'
    }
  },
  ({ a, b }) => {
    return a + b
  }
)

// sends to server
let response = {
  id: 2848,
  query: 'add_service',
  name: 'add',
  args: {
    a: {
      type: 'int'
    },
    b: {
      type: 'int'
    }
  }
}

// server handles request
connection.on('add_service', ({ name, args }) => {
  this.services.set(name, {
    connection: connection,
    args: args
  })

  connection.query('received', true)
})

// client wants to use service
client.call('add', 1, 2)

// client sends
let response = {
  id: 1204,
  query: 'call_service',
  name: 'add',
  args: [1, 2]
}

// server handles request
connection.on('call_service', ({ name, args }) => {
  if (Array.isArray(args)) {
    // verify types of args
    // map args or something
    let data = this.services.get(name).connection.query('call', { args })
  }
})
// server sends to service
let response = {
  id: 3244,
  query: 'call',
  args: [1, 2]
}

// service recieves
connection.on('call', ({ args }) => {
  this.respond(this.services.get('call')(args))
})

// service sends to server
// server sends to client
let response = {
  id: 3244,
  query: 'response',
  value: 3
}
```
