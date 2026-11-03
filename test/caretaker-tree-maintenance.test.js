'use strict'

const { TernarySearchTree } = require('../lib/core/tree')
const { test } = require('node:test')
const assert = require('node:assert')

test('long ascii key can be inserted and looked up on a fresh tree', () => {
  const LENGTH = 20000
  let key = ''
  for (let i = 0; i < LENGTH; ++i) {
    key += String.fromCharCode(97 + (i % 26))
  }
  const tst = new TernarySearchTree()
  tst.insert(key, 'long-value')
  assert.strictEqual(tst.lookup(Buffer.from(key)), 'long-value')
})

test('long ascii key can be inserted and looked up on an existing tree', () => {
  const LENGTH = 20000
  let key = ''
  for (let i = 0; i < LENGTH; ++i) {
    key += String.fromCharCode(97 + ((i * 7) % 26))
  }
  const tst = new TernarySearchTree()
  tst.insert('seed', 'seed-value')
  tst.insert(key, 'long-value')
  assert.strictEqual(tst.lookup(Buffer.from(key)), 'long-value')
  assert.strictEqual(tst.lookup(Buffer.from('seed')), 'seed-value')
})

test('prefix of a long key does not match and overwrite still works', () => {
  const LENGTH = 20000
  let key = ''
  for (let i = 0; i < LENGTH; ++i) {
    key += 'ab'
  }
  const tst = new TernarySearchTree()
  tst.insert(key, 'first')
  // A strict prefix is not a stored key.
  assert.strictEqual(tst.lookup(Buffer.from(key.slice(0, LENGTH - 1))), null)
  // Overwriting the same key replaces the value.
  tst.insert(key, 'second')
  assert.strictEqual(tst.lookup(Buffer.from(key)), 'second')
})

test('long key lookup is case-insensitive', () => {
  const LENGTH = 20000
  let lower = ''
  for (let i = 0; i < LENGTH; ++i) {
    lower += 'x'
  }
  let upper = ''
  for (let i = 0; i < LENGTH; ++i) {
    upper += 'X'
  }
  const tst = new TernarySearchTree()
  tst.insert(lower, 'folded')
  assert.strictEqual(tst.lookup(Buffer.from(upper)), 'folded')
})

test('empty key and non-ascii key still throw', () => {
  assert.throws(() => new TernarySearchTree().insert('', 'a'), TypeError)
  const tst = new TernarySearchTree()
  tst.insert('a', 'a')
  assert.throws(() => tst.insert('', 'a'), TypeError)
  assert.throws(() => tst.insert('\x80', 'a'), TypeError)
  assert.throws(() => new TernarySearchTree().insert('\x80', 'a'), TypeError)
})
