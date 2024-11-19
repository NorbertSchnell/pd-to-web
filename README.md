# Pd to Web

In this example, incoming UDP messages (e.g. from Pure Data) are sent via websockets to a web client.

## Setting up

### Install Node modules
```
npm install
```

## Starting up

- start node server
```
node server.js
```

... and
- open the URL *localhost:3000* in a web browser
- send UDP messages to *localhost:4000* (e.g. using the Pd patch *pd-to-web.pd*)
