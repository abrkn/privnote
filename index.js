const assert = require('assert');
const superagent = require('superagent');
const randomstring = require('randomstring').generate;
const GibberishAES = require('gibberish-aes/src/gibberish-aes');

const PRIVNOTE_BASE_URL = 'https://privnote.com';
const PRIVNOTE_BASE_HEADERS = { 'X-Requested-With': 'XMLHttpRequest' };
const PRIVNOTE_AUTO_PASSPHRASE_LENGTH = 9;
const PRIVNOTE_CIPHER = 'aes-256-cbc';

exports.createPrivnote = async (
  body,
  { passphrase = null, ask = true, durationHours = 0 } = {}
) => {
  const hasManualPassphrase = passphrase !== null;

  if (!hasManualPassphrase) {
    passphrase = randomstring({
      length: PRIVNOTE_AUTO_PASSPHRASE_LENGTH,
      charset: 'alphanumeric',
    });
  }

  // const passphraseBuffer = Buffer.from(passphrase);

  const ciphertextBase64 = GibberishAES.enc(
    body.toString(),
    passphrase.toString()
  );

  const response = await superagent
    .post(`${PRIVNOTE_BASE_URL}/legacy/`)
    .type('form')
    .set(PRIVNOTE_BASE_HEADERS)
    .send({
      '': '',
      data: ciphertextBase64,
      has_manual_pass: hasManualPassphrase.toString(),
      duration_hours: durationHours,
      dont_ask: (!ask).toString(),
      data_type: 'T',
      notify_email: '',
      notify_ref: '',
    });

  const noteId = response.body.note_link.match(/[^/]+$/)[0];

  return {
    id: noteId,
    url: `${PRIVNOTE_BASE_URL}/${noteId}#${passphrase}`,
    passphrase,
  };
};

exports.retrievePrivnote = async (idOrUrl, passphrase) => {
  assert(idOrUrl, 'idOrUrl is required');

  const match = idOrUrl.match(`^${PRIVNOTE_BASE_URL}\\/([^#]+)#(.+)$`);

  if (match) {
    id = match[1];
    passphrase = match[2];
  } else {
    id = idOrUrl;
  }

  assert(passphrase, 'passphrase is required');

  const response = await superagent
    .delete(`${PRIVNOTE_BASE_URL}/${id}`)
    .set(PRIVNOTE_BASE_HEADERS);

  const { destroyed, data: ciphertext } = response.body;

  if (!ciphertext) {
    throw new Error(`Note was destroyed on ${destroyed}`);
  }

  const cleartext = GibberishAES.dec(ciphertext, passphrase.toString());

  return cleartext;
};

exports.isPrivnoteUrl = url =>
  typeof url === 'string' &&
  !!url.match(/^https:\/\/privnote.com\/[a-zA-Z0-9]+#[a-zA-Z0-9]+$/);
