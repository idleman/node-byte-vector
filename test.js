var assert = require('assert'),
    ByteVector = require('./index');


describe('ByteVector', function () {
  describe('Default constructed', function() {
    var vector = new ByteVector();
    it('default size should be zero', function () {
      assert.equal(vector.length, 0);
    });

    it('#push_back', function () {
      var test = [1, 2, 3, 4, 5];
      test.forEach(function (val) { vector.push_back(val); });
      assert.equal(vector.length, test.length);
      assert.equal(vector.back(), test[test.length -1 ]);
    });
    it('#push_front', function () {
      var len = vector.length;
      vector.push_front(0);
      assert.equal(vector.length, len+1);
      assert.equal(vector.front(), 0);
    });
    it('#pop_front', function () {
      var len = vector.length,
          front_val = vector.front();

      assert.equal(vector.pop_front(), front_val);
      assert.equal(vector.length, len - 1);
      assert.notEqual(vector.front(), front_val);
    });
    it('#pop_back', function () {
      var len = vector.length,
          back_val = vector.back();

      assert.equal(vector.pop_back(), back_val);
      assert.equal(vector.length, len - 1);
      assert.notEqual(vector.back(), back_val);
    });
    it('#resize', function () {
      var len = vector.length,
          front_val = vector.front(),
          back_val = vector.back();

      assert.equal(vector.length <= vector.capacity(), true);

      var newSize = vector.size() + 1;
      vector.resize(newSize);
      assert.equal(vector.length, newSize);
      assert.equal(vector.front(), front_val);
      assert.notEqual(vector.back(), back_val);
    });

    it('#get', function () {
      assert.equal(vector.get(0), vector.front());
      assert.equal(vector.get(vector.length - 1), vector.back());
    });
    it('#set', function () {
      assert.equal(vector.get(0), vector.front());
      vector.set(0, 100);
      assert.equal(vector.front(), 100);
    });

    it('#assign', function () {
      var list = [5];
      vector.assign(list);
      assert.equal(vector.front(), list[0]);
      assert.equal(vector.back(), list[list.length-1]);
      assert.equal(vector.length, list.length);
      
      while (list.length) {
        assert.equal(list.pop(), vector.pop());
      }
    });

    it('#forEach', function () {
      var counter = 0;
      vector.forEach(function(value, index, array) {
        assert.equal(vector, array);
        assert.equal(value, vector.get(counter));
        assert(counter++, index);
      });
      assert.equal(counter, vector.length);
    });

    it('#clear', function () {
      vector.clear();
      assert.equal(vector.size(), 0);
    });
    it('#shrink_to_fit', function () {
      vector.push_back(1);
      vector.push_back(2);
      vector.push_back(3);
      vector.pop_back();
      vector.shrink_to_fit();
      assert.equal(vector.size(), vector.capacity());
      assert.equal(vector.get(0), 1);
      assert.equal(vector.get(1), 2);
    });
    it('#buffer', function () {
      var buf = vector.buffer();
      assert.equal(buf instanceof Uint8Array, true);
    });
    var shouldImplement = [
        'front',
        'back',
        'push',
        'pop',
        'reserve',
        'capacity',
        'resize',
        'push_back',
        'push_front',
        'pop_back',
        'pop_front',
        'get',
        'set',
        'clear',
        'buffer',
        'shrink_to_fit'
    ];
    shouldImplement.forEach(function (method) {
      it('should implement method: ' + method, function () {
        assert.equal(typeof vector[method], 'function');
      });
    });
  });

  describe('Array constructed', function () {

    var vector = new ByteVector([1, 2, 3, 4, 5]);
    vector.push_back(6);
    vector.pop_front();

    var copy = new ByteVector(vector); //[2, 3, 4, 5, 6]

    assert.equal(copy.length, 5);
    assert.equal(copy.front(), 2);
    assert.equal(copy.back(), 6);

  });

});