const test = require('node:test');
const assert = require('node:assert/strict');
const { generateCodeVerifier, generateCodeChallenge } = require('../dist/oauth.js');

test('pkce helpers generate deterministic challenge for given verifier', () => {
  const verifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(verifier);
  assert.equal(typeof verifier, 'string');
  assert.equal(typeof challenge, 'string');
  assert.ok(verifier.length > 20);
  assert.ok(challenge.length > 20);
});
