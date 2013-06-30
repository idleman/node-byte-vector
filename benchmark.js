var ByteVector = require('./index');

process.stdout.write('Benchamrking ByteVector, please wait...\n\n');


var vector = ByteVector();


var tests = [
  {
    name: "warm up",
    prepare: function (testcount) {
      return new ByteVector();
    },
    handler: function (vector) {
      vector.push_back(2);
      vector.pop_back();
    }
  },
  {
    name: "push_back",
    prepare: function(testcount) {
      return new ByteVector();
    },
    handler: function (vector) {
      vector.push_back(2);
    }
  },
  {
    name: "push_back with reserve",
    prepare: function (testcount) {
      var vector = new ByteVector();
      vector.reserve(testcount);
      return vector;
    },
    handler: function (vector) {
      vector.push_back(2);
    }
  },
  {
    name: "pop_back",
    prepare: function (testcount) {
      var vector = new ByteVector(testcount);
      while (0 < --testcount) {
        vector.push_back(3);
      }
      return vector;
    },
    handler: function (vector) {
      vector.pop_back();
    }
  },
  {
    name: "pop_front",
    prepare: function (testcount) {
      var vector = new ByteVector(testcount);
      while (0 < --testcount) {
        vector.push_back(3);
      }
      return vector;
    },
    handler: function (vector) {
      vector.pop_front();
    }
  }
];


var NumberOfTests = 1024*1024;
tests.forEach(function (test) {
  process.stdout.write('\nRunning test: "' + test.name + '"...');

  var avgOperationsPerMS = [];
  for (var i = 0, len = 10; i < len; ++i) {
    var counter = NumberOfTests,
        vector = test.prepare(NumberOfTests),
        handler = test.handler,
        startTime = (new Date()).getTime();

    while (0 < --counter) {
      handler(vector);
    }
    var endTime = (new Date()).getTime(),
        diff = endTime - startTime,
        operationsPerMS = NumberOfTests / diff;

    avgOperationsPerMS.push(operationsPerMS);
  }

  var total = 0;
  avgOperationsPerMS.forEach(function (opms) {
    total += opms;
  });
  var avg = total/avgOperationsPerMS.length;
  process.stdout.write('\n\t' + parseInt(avg*1000) + '/s');
});