# miniserve

> a small microservice controller and client I made to learn about microservices

this is written with websockets, after writing this I realized this was a bad option and that a connection that does not need to stay active would be much better for an on-off call/add process

if I where to do this again I'd write it using http or some other non long-polling/heartbeat needed solution.

TODO: _probably never, but please submit an issue or pull request if you want any of these_
- [ ] add tests
- [ ] switch to http or similar
- [ ] client should work in browser (it's not hard to do)

```js
// nothing else is needed, simply run the server with configuration options
const server = new ServiceServer({ port: 8080 })
```

```js
const client = new ServiceClient('ws://localhost', 8080)

client.add('sum', ([a, b]) => {
  return a + b
})
```

```js
const client = new ServiceClient('ws://localhost', 8080)

client.call('sum', 1, 2) // 3
```