const test = require('ava');
const { createPrivnote, retrievePrivnote, isPrivnoteUrl } = require('./');

test('without passphrase', async t => {
  const expectedBody = 'hello world';

  const { id, passphrase } = await createPrivnote(expectedBody);

  const actualBody = await retrievePrivnote(id, passphrase);

  t.is(actualBody, expectedBody);
});

test('with passphrase', async t => {
  const expectedBody = 'hello internet';
  const passphrase = 'custom passphrase';

  const { id } = await createPrivnote(expectedBody, { passphrase });

  const actualBody = await retrievePrivnote(id, passphrase);

  t.is(actualBody, expectedBody);
});

test('with url', async t => {
  const expectedBody = 'hello world';

  const { url } = await createPrivnote(expectedBody);

  const actualBody = await retrievePrivnote(url);

  t.is(actualBody, expectedBody);
});

test('isPrivnoteUrl', async t => {
  const valids = [
    'https://privnote.com/abcde#fg123',
    'https://privnote.com/GqX61SLm#c38LMmEZb',
  ];

  valids.forEach(_ => t.is(isPrivnoteUrl(_), true));

  const invalids = [
    'test',
    '',
    'http://privnote.com/abc#123',
    'https://privnote.com/abc#123?',
    'https://privnote.com/abc#',
  ];

  invalids.forEach(_ => t.is(isPrivnoteUrl(_), false));
});
