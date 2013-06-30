

module.exports = (function () {

  //somewhat optimized copy method.
  function copy(src, dest, offset) {
    var len = src.length;
    for (; --len >= 0;) {
      dest[len + offset] = src[len];
    }
  }

  /**
  * [size(4) + offset(4)]
  */
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
    _getSize: function () {
      return this._size;
    },
    _setSize: function (N) {
      this._size = N;
    },
    _getBuffer: function () {
      return this._buffer;
    },
    _setBuffer: function (val) {
      this._buffer = val;
    },
    _getOffset: function () {
      return this._offset;
    },
    _setOffset: function (val) {
      this._offset = val;
    },
    _reserve: function (N, offset, cp) {
      var size = N + offset;
      if (this.capacity() < size) {
        var buf = new Uint8Array(size);

        if(cp) {
          copy(this._getBuffer(), buf, offset);
        }
        this._setBuffer(buf);
        this._setOffset(offset);
      }
    },
    front: function () {
      var buffer = this._getBuffer();
      return buffer[this._getOffset()];
    },
    back: function () {
      var buffer = this._getBuffer();
      return buffer[this._getOffset() + this._getSize() - 1];
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
      return this._getSize();
    },
    resize: function (N) {
      if (this.capacity() < N) {
        this._reserve(N, this._getOffset());
      }
      this._setSize(N);
    },
    assign: function(src, offset, length) {
      var offset = offset || 0,
          length = length || (src.length-offset),
          size = offset + length,
          buffer = this._getBuffer();

      this._reserve(size, 0, false);
      if (src instanceof ByteVector) {

        var src_buffer = src._getBuffer(),
            src_offset = src._getOffset() + offset;

        for (; --length >= 0;) {
          buffer[length] = src_buffer[src_offset + length];
        }
      } else {
        for (; --length >= 0;) {
          buffer[length] = src[length + offset];
        }
      }
      this._setSize(size);
      this._setOffset(0);
    },
    reserve: function(N) {
      return this._reserve(N, 0, true);
    },
    push_back: function (uint8) {
      if (this.capacity() === this.size()) {
        this.reserve(this.capacity() * 2);
      }
      var buffer = this._getBuffer(),
          size = this._getSize(),
          pos = this._getOffset() + size;

      buffer[pos] = uint8;
      this._setSize(++size);
    },

    push_front: function (uint8) {
      
      if (0 === this._getOffset()) {
        this._reserve(this.capacity() * 2, 1, true);
      }
      var offset = this._getOffset(),
          size = this._getSize(),
          buffer = this._getBuffer();

      buffer[--offset] = uint8;
      ++size;
      this._setOffset(offset);
      this._setSize(size);
    },
    pop_front: function () {
      var offset = this._getOffset(),
          buffer = this._getBuffer();

      this._setOffset(offset + 1);
      this._setSize(this._getSize() - 1);

      return buffer[offset];
    },
    pop_back: function () {
      var size = this._getSize(),
          offset = this._getOffset(),
          buffer = this._getBuffer();

      this._setSize(--size);
      return buffer[offset + size];
    },
    get: function (pos) {
      var buffer = this._getBuffer(),
          offset = this._getOffset();

      return buffer[offset + pos];
    },
    set: function (pos, val) {
      var buffer = this._getBuffer(),
          offset = this._getOffset();

      buffer[offset + pos] = val;
    },
    clear: function () {
      this._setBuffer(new Uint8Array(1));
      this._setOffset(0);
      this._setSize(0);
    },
    serialize: function () {
      return this._buffer;
    }
  };

  return ByteVector;
})();