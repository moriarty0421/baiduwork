var chai = require('chai');
var expect = chai.expect;
var Main = require('../main.js');

describe("division", function() {

  it("4/2 应该为 2", function() {
    expect(Main.division(4,2)).to.equal(2);
  });

  it("4/0 参数为0时应该报错", function() {
    expect(function(){Main.division(4,0)}).to.throw('除数不可以为 0 哦 亲!');
  });
});