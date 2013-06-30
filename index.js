

module.exports = (function () {

  //somewhat optimized copy method.
  function copy(src, dest, offset) {
    var len = src.length;
    for (; --len >= 0;) {
      dest[len + offset] = src[len];
    }
  }

  function ByteVector(obj, offset, length) {
    var self = this;

    
    Object.defineProperty(this, 'length', {
      get: function() {
        return self.size();
      },
      set: function (val) {
        self.resize(val);
      }
    });


    this._offset = 0;
    this._size = 0;

    if(obj) {
      if (typeof obj === 'number') {
        this._buffer = new Uint8Array(obj);
      } else {;
        this._buffer = new Uint8Array(obj.length);
        this.assign(obj, offset, length);
      }
    } else {
      this._buffer = new Uint8Array(1);
    }
   

    

    // we can emulalate operator [] (using defineProperty(this, 'N' ...), but
    // we choice not to for performance reasons.
  }

  ByteVector.prototype = {

    _reserve: function (N, offset, cp) {
      var size = N + offset;
      if (this.capacity() < size) {
        var buf = new Uint8Array(size);

        if(cp) {
          copy(this._buffer, buf, offset);
        }
        this._buffer = buf;
        this._offset = offset;
      }
    },
    front: function() {
      return this._buffer[this._offset];
    },
    back: function () {
      return this._buffer[this._offset + this._size - 1];
    },
    push: function (uint8) {
      return this.push_back(uint8);
    },
    pop: function (uint8) {
      return this.pop_back(uint8);
    },
    capacity: function (uint8) {
      return this._buffer.length;
    },
    size: function () {
      return this._size;
    },
    resize: function (N) {
      if (this.capacity() < N) {
        this._reserve(N, this._offset);
      } 
      this._size = N;
    },
    assign: function(src, offset, length) {
      var offset = offset || 0,
          length = length || (src.length-offset),
          size = offset + length;

      this._reserve(size, 0, false);
      if (src instanceof ByteVector) {
        for (; --length >= 0;) {
          this._buffer[length] = src._buffer[src._offset + length + offset];
        }
      } else {
        for (; --length >= 0;) {
          this._buffer[length] = src[length + offset];
        }
      }
      this._size = size;
      this._offset = 0;
    },
    reserve: function(N) {
      return this._reserve(N, 0, true);
    },
    push_back: function (uint8) {
      if (this._buffer.length === this._size) { //this.capacity() === this.size()) {
        this.reserve(this.capacity() * 2);
      }
      this._buffer[this._offset + this._size++] = uint8;
    },

    push_front: function (uint8) {
      if (0 === this._offset) {
        this._reserve(this.capacity() * 2, 1, true);
      }
      this._buffer[--this._offset] = uint8;
      ++this._size;
    },
    pop_front: function () {
      ++this._offset;
      --this._size;
      return this._buffer[this._offset - 1];
    },
    pop_back: function () {
      --this._size;
      return this._buffer[this._offset + this._size];
    },
    get: function (pos) {
      return this._buffer[this._offset + pos];
    },
    set: function (pos, val) {
      this._buffer[this._offset + pos] = val;
    },
    clear: function () {
      this._buffer = new Uint8Array(1);
      this._offset = 0;
      this._size = 0;
    },

    forEach: function (cb) {
      for (var i = 0, len = this._size; i < len; ++i) {
        cb(this.get(i), i, this);
      }
    }

  };

  return ByteVector;
})();