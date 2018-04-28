# Face emotion detector

Cloud Journey #13 - Face emotion detector web application using Azure Cogintive Service APIs, React.js and Node.

## Application settings 

```javascript
// server/env/environment.js
const cosmosPort = 1234; // your port
const dbName = 'your-cosmos-db-name';
const key = 'your-key';

module.exports = {
  cosmosPort,
  dbName,
  key
};
```

## Running The App
```bash
npm install
```

In development, the app runs via two separate processes.

### Start the Express Server

```bash
node server/server.js
```


### Start React App

In a different terminal tab

```bash
npm start
```


