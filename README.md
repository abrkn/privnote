# privnote

> Unofficial Privnote.com Client for Node.js

[![Build Status](https://travis-ci.org/abrkn/privnote.svg?branch=master)](https://travis-ci.org/abrkn/privnote)

# Install

`npm install privnote`

# Usage

```javascript
const { createPrivnote, retrievePrivnote } = require('privnote');

const created = await createPrivnote('hello privnote.com!');

console.log(created);
// { id: 'Fbg9fXIf',
//     url: 'https://privnote.com/Fbg9fXIf#3pVfRzWrr',
//     passphrase: '3pVfRzWrr' }

const retrieved = await retrievePrivnote(created.id, created.passphrase);

console.log(retrieved);
// hello privnote.com!
```

See `example.js`

# Test

`npm test`

# Author

Andreas Brekken <andreas@brekken.com>
