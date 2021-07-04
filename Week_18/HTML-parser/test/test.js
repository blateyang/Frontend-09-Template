import {parseHTML} from "../src/parser.js"
var assert = require('assert');

describe('parseHTML test', function() {
    let testStr
    it('<a></a>', function() {
      let tree = parseHTML('<a></a>')
      assert.equal(tree.children[0].tagName, 'a');
      assert.equal(tree.children[0].children.length, 0);
    });

    it('<a href="http://time.geekbang.com"></a>', function() {
      let tree = parseHTML('<a href="http://time.geekbang.com"></a>')
      assert.equal(tree.children[0].tagName, 'a');
      assert.equal(tree.children[0].attributes.length, 1);
    });

    it('<html><head><style>a {font-size:10px;}</style></head><body><a></a></body></html>', function() {
      let tree = parseHTML('<html><head><style>a {font-size:10px;}</style></head><body><a></a></body></html>')
      assert.equal(tree.children[0].tagName, 'html');
      assert.equal(tree.children[0].children.length, 2);
    });

    testStr =  '<html><head><style>p.text#name {font-size:10px;}</style></head><body><p class="text" id="name">text</p></body></html>'
    it(testStr, function() {
      let tree = parseHTML(testStr)
      assert.equal(tree.children[0].tagName, 'html');
      assert.equal(tree.children[0].children.length, 2);
    });

    testStr =  '<!DOCTYPE html><html><head><style>a {font-size:10px;}</style></head><body><a></a></body></html>'
    it(testStr, function() {
      let tree = parseHTML(testStr)
      assert.equal(tree.children[0].tagName, 'html');
      assert.equal(tree.children[0].children.length, 2);
    });

    testStr =  '<html><head><style>p.text#name {font-size:10px;}</style></head><body><p class="text" id="name">text</p><img src ="xx"/></body></html>'
    it(testStr, function() {
      let tree = parseHTML(testStr)
      assert.equal(tree.children[0].tagName, 'html');
      assert.equal(tree.children[0].children.length, 2);
    });
    
    testStr =  "<!DOCTYPE html><html><head><style>p.text#name {font-size:10px;}</style></head><body><p class='text' id='name'>text</p><img width=200/></body></html>"
    it(testStr, function() {
      let tree = parseHTML(testStr)
      assert.equal(tree.children[0].tagName, 'html');
      assert.equal(tree.children[0].children.length, 2);
    });

    testStr =  "<!DOCTYPE html><html><head><style>p.text#name {font-size:10px;}</style></head><body><p class='text' id='name'>text</p><img width=200 required/></body></html>"
    it(testStr, function() {
      let tree = parseHTML(testStr)
      assert.equal(tree.children[0].tagName, 'html');
      assert.equal(tree.children[0].children.length, 2);
    });

    testStr =  "<html><head><style>p.text#name {font-size:10px;}</style></head><body><p class='text' id='name' required>text</p><img width=200 required/></body></html>"
    it(testStr, function() {
      let tree = parseHTML(testStr)
      assert.equal(tree.children[0].tagName, 'html');
      assert.equal(tree.children[0].children.length, 2);
    });

    testStr =  "<!DOCTYPE html><html><head><style>p {font-size:20px;}\np.text {font-size:15px}\np.text#name {font-size:10px;}</style></head><body><p required >xx</p><p font-size=10>xx</p><p class='text' id='name' required>text</p><img width=200 required/></body></html>"
    it(testStr, function() {
      let tree = parseHTML(testStr)
      assert.equal(tree.children[0].tagName, 'html');
      assert.equal(tree.children[0].children.length, 2);
    });
});

