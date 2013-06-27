node-byte-vector
================

ByteVector for node.js. Perfect for binary data. Usage:

  var ByteVector = requite('bytevector');

  var vector = new ByteVector([1, 2, 3, 4, 5]);

  vector.push_back(6); //finsert 6 in the end
  vector.pop_front();
  
  var copy = new ByteVector(vector); //[2, 3, 4, 5, 6]
  
##Features:

- Space effcient.
- Performance wise.


##Methods

###Constructor(int):
  Construct an empty vector with reserved size [int].

###Constructor(array):
  Construct a vector with values from [array].

###Constructor(array, offset):
  Construct a vector from [array] range: [offset, to_array_end).

###Constructor(array, offset, length):
  Construct a vector from [array] range: [offset, offset+length).

###.front()
  Returns the first element in the vector.

###.back()
  Returns the last element in the vector.

###.push(Uint8)
  Insert [Uint8] in the back of of the vector.

###.pop()
  Remove last item and returns it. Alias for .pop_back()

###.reserve(Uint32)
  Reserve [Uint32] amount of memory.

###.capacity()
  Return reserved memory.

###.resize(Uint32)
  Resize vector size to [Uint32] elements.

###.push_back(Uint8)
  Insert [Uint8] in the back of the vector.

###.push_front(Uint8)
  Insert [Uint8] in the beginning of the vector.

###.pop_back()
  Remove last item in the vector and returns it.

###.pop_front()
  Remove first element in the beginning of the vector and returns it.

###.get(pos)
  Return element at position [pos].

###.set(pos, value)
  Set element at position [pos] to value [value].

###.clear()
  Removes all elements from the vector.

###.size()
  Returns current vector size.

###.length
  Returns current vector size.

###.length = N
  Resize vector to [N] elements.