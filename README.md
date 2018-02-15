# directus-sdk-javascript

Directus SDK for JavaScript (Node and Browser)

<p align="center">
<img src="https://s3.amazonaws.com/f.cl.ly/items/3Q2830043H1Y1c1F1K2D/directus-logo-stacked.png" alt="Directus Logo"/>
</p>

## Installation

Install the package using [npm](https://www.npmjs.com) or [Yarn](https://yarnpkg.com/):
`npm install directus-sdk-javascript --production` or `yarn add directus-sdk-javascript`

Or download the repo and include `/dist/remote.js` into your document:
`<script src="/dist/remote.js"></script>`

Or use a service that distributes npm packages like [unpkg](https://unpkg.org):
`<script src="https://unpkg.com/directus-sdk-javascript/dist/remote.js"></script>`


## Usage

Create a new client passing it the options needed to create a connection:

```javascript
// Only in Node / non-bundled version:
const RemoteInstance = require('directus-sdk-javascript/remote');

// Or (es6+):
import { RemoteInstance } from 'directus-sdk-javascript';

const client = new RemoteInstance({
  url: 'http://instance.directus.io/',
  version: '1.1', // optional, only need to update if different from default
  accessToken: [user-token] // optional, can be used without on public routes
});
```

The client provides methods for each API endpoint. Every endpoint returns a promise which resolves the APIs JSON on success and rejects on an error:

```javascript
client.getItems('projects')
  .then(res => console.log(res))
  .catch(err => console.log(err));
```


Get and update the current logged in user:

```javascript
client.getMe()
  .then(res => console.log(res))
  .catch(err => console.log(err));

client.updateMe({first_name: 'John', last_name: 'Doe'})
  .then(res => console.log(res))
  .catch(err => console.log(err));
```


Custom api endpoints, implemented on the server under `customs/endpoints`, are also available. Here is an example for calling the `http://instance.directus.io/api/example` endpoint:

```javascript
client.getApi('example')
  .then(res => console.log(res))
  .catch(err => console.log(err));

client.postApi('example', {custom_var: 'value'})
  .then(res => console.log(res))
  .catch(err => console.log(err));
```

Since the SDK uses promises, you can also use it with [async/await](https://www.youtube.com/watch?v=9YkUCxvaLEk):
```javascript
const projects = await client.getItems('projects');
```

Check [the official API docs for a complete overview of all endpoints and available methods](https://api.getdirectus.com/1.1/#Getting_Data)
