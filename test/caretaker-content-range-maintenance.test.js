'use strict'

const { test } = require('node:test')
const assert = require('node:assert')
const { parseRangeHeader } = require('../lib/core/util.js')

test('parseRangeHeader returns sentinel for absent and empty header', () => {
  assert.deepStrictEqual(parseRangeHeader(undefined), { start: 0, end: null, size: null })
  assert.deepStrictEqual(parseRangeHeader(null), { start: 0, end: null, size: null })
  assert.deepStrictEqual(parseRangeHeader(''), { start: 0, end: null, size: null })
})

test('parseRangeHeader parses valid ranges', () => {
  assert.deepStrictEqual(parseRangeHeader('bytes 0-9/10'), { start: 0, end: 9, size: 10 })
  assert.deepStrictEqual(parseRangeHeader('bytes 5-9/10'), { start: 5, end: 9, size: 10 })
  assert.deepStrictEqual(parseRangeHeader('bytes 0-9/*'), { start: 0, end: 9, size: null })
  assert.deepStrictEqual(parseRangeHeader('bytes 0-9/'), { start: 0, end: 9, size: null })
})

test('parseRangeHeader preserves leading-zero parsing', () => {
  assert.deepStrictEqual(parseRangeHeader('bytes 007-009/010'), { start: 7, end: 9, size: 10 })
})

test('parseRangeHeader rejects unsafe integer conversions', () => {
  assert.strictEqual(parseRangeHeader('bytes 9007199254740992-9007199254740993/9007199254740994'), null)
  assert.strictEqual(parseRangeHeader('bytes 0-9007199254740993/9007199254740994'), null)
  assert.strictEqual(parseRangeHeader('bytes 0-1/9007199254740993'), null)
})

test('parseRangeHeader rejects reversed intervals', () => {
  assert.strictEqual(parseRangeHeader('bytes 5-3/10'), null)
  assert.strictEqual(parseRangeHeader('bytes 10-1/10'), null)
})

test('parseRangeHeader rejects known complete lengths not exceeding final position', () => {
  assert.strictEqual(parseRangeHeader('bytes 0-10/10'), null)
  assert.strictEqual(parseRangeHeader('bytes 0-9/9'), null)
  assert.deepStrictEqual(parseRangeHeader('bytes 0-9/10'), { start: 0, end: 9, size: 10 })
})

test('parseRangeHeader rejects malformed headers', () => {
  assert.strictEqual(parseRangeHeader('bytes=0-9/10'), null)
  assert.strictEqual(parseRangeHeader('bytes 0-9'), null)
})
