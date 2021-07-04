// var add = require("../add.js").add
// var mul = require("../add.js").mul

import {add, mul} from "../add.js"
var assert = require('assert');

describe('test add function', function() {
    it('1 + 2 should return 3', function() {
      assert.equal(add(1, 2), 3);
    });
});


describe('test mul function', function() {
  it('3 * 2 should return 6', function() {
    assert.equal(mul(3, 2), 6);
  });
});
