#!/usr/bin/env node
const { createPrivnote, retrievePrivnote } = require('./');

(async () => {
  const created = await createPrivnote('hello privnote.com!');
  console.log(created);

  const retrieved = await retrievePrivnote(created.id, created.passphrase);
  console.log(retrieved);
})().then(process.exit);
