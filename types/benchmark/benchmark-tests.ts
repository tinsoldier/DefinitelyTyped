import Benchmark = require("benchmark");

var suite = new Benchmark.Suite;

// add tests
suite.add('RegExp#test', function() {
  /o/.test('Hello World!');
})
.add('String#indexOf', function() {
  'Hello World!'.indexOf('o') > -1;
})
.add('String#match', function() {
  !!'Hello World!'.match(/o/);
})
// add listeners
.on('cycle', function(event: {target: any}) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });

var fn: () => void;
var onStart: () => void;
var onCycle: () => void;
var onAbort: () => void;
var onError: () => void;
var onReset: () => void;
var onComplete: () => void;
var setup: () => void;
var teardown: () => void;
var benches: Benchmark[];
var listener: () => void;
var count: number;

// basic usage (the `new` operator is optional)
var bench = new Benchmark(fn);

// or using a name first
var bench = new Benchmark('foo', fn);

// or with options
var bench = new Benchmark('foo', fn, {

  // displayed by Benchmark#toString if `name` is not available
  'id': 'xyz',

  // called when the benchmark starts running
  'onStart': onStart,

  // called after each run cycle
  'onCycle': onCycle,

  // called when aborted
  'onAbort': onAbort,

  // called when a test errors
  'onError': onError,

  // called when reset
  'onReset': onReset,

  // called when the benchmark completes running
  'onComplete': onComplete,

  // compiled/called before the test loop
  'setup': setup,

  // compiled/called after the test loop
  'teardown': teardown
});

// or name and options
var bench = new Benchmark('foo', {

  // a flag to indicate the benchmark is deferred
  'defer': true,

  // benchmark test function
  'fn': function(deferred: {resolve(): void}) {
    // call resolve() when the deferred test is finished
    deferred.resolve();
  }
});

// or options only
var bench = new Benchmark({

  // benchmark name
  'name': 'foo',

  // benchmark test as a string
  'fn': '[1,2,3,4].sort()'
});

// a test’s `this` binding is set to the benchmark instance
var bench = new Benchmark('foo', function() {
  'My name is '.concat(this.name); // My name is foo
});

// $ExpectType number[]
Benchmark.filter([1, 2, 3, 4, 5], function(n) {
  return n % 2 !== 0;
});

// get fastest benchmarks
Benchmark.filter(benches, 'fastest'); // $ExpectType Benchmark[]

// get slowest benchmarks
Benchmark.filter(benches, 'slowest'); // $ExpectType Benchmark[]

// get benchmarks that completed without erroring
Benchmark.filter(benches, 'successful'); // $ExpectType Benchmark[]

// invoke `reset` on all benchmarks
Benchmark.invoke(benches, 'reset');

// invoke `emit` with arguments
Benchmark.invoke(benches, 'emit', 'complete', listener);

// invoke `run(true)`, treat benchmarks as a queue, and register invoke callbacks
Benchmark.invoke(benches, {

  // invoke the `run` method
  'name': 'run',

  // pass a single argument
  'args': true,

  // treat as queue, removing benchmarks from front of `benches` until empty
  'queued': true,

  // called before any benchmarks have been invoked.
  'onStart': onStart,

  // called between invoking benchmarks
  'onCycle': onCycle,

  // called after all benchmarks have been invoked.
  'onComplete': onComplete
});

var element: HTMLElement;
// basic usage
var bench = new Benchmark({
  'setup': function() {
    var c = this.count,
      element = document.getElementById('container');
    while (c--) {
      element.appendChild(document.createElement('div'));
    }
  },
  'fn': function() {
    element.removeChild(element.lastChild);
  }
});

// or using strings
var bench = new Benchmark({
  'setup': '\
    var a = 0;\n\
    (function() {\n\
      (function() {\n\
        (function() {',
  'fn': 'a += 1;',
  'teardown': '\
         }())\n\
       }())\n\
     }())'
});

// $ExpectType Benchmark
var bizarro = bench.clone({
  'name': 'doppelganger'
});

// unregister a listener for an event type
bench.off('cycle', listener); // $ExpectType Benchmark

// unregister a listener for multiple event types
bench.off('start cycle', listener); // $ExpectType Benchmark

// unregister all listeners for an event type
bench.off('cycle'); // $ExpectType Benchmark

// unregister all listeners for multiple event types
bench.off('start cycle complete'); // $ExpectType Benchmark

// unregister all listeners for all event types
bench.off(); // $ExpectType Benchmark

// register a listener for an event type
bench.on('cycle', listener); // $ExpectType Benchmark

// register a listener for multiple event types
bench.on('start cycle', listener); // $ExpectType Benchmark

// basic usage
bench.run(); // $ExpectType Benchmark

// or with options
bench.run({ 'async': true }); // $ExpectType Benchmark

// basic usage
suite.add(fn); // $ExpectType Suite

// or using a name first
suite.add('foo', fn); // $ExpectType Suite

// or with options
// $ExpectType Suite
suite.add('foo', fn, {
  'onCycle': onCycle,
  'onComplete': onComplete
});

// or name and options
// $ExpectType Suite
suite.add('foo', {
  'fn': fn,
  'onCycle': onCycle,
  'onComplete': onComplete
});

// or options only
// $ExpectType Suite
suite.add({
  'name': 'foo',
  'fn': fn,
  'onCycle': onCycle,
  'onComplete': onComplete
});

// unregister a listener for an event type
suite.off('cycle', listener); // $ExpectType Suite

// unregister a listener for multiple event types
suite.off('start cycle', listener); // $ExpectType Suite

// unregister all listeners for an event type
suite.off('cycle'); // $ExpectType Suite

// unregister all listeners for multiple event types
suite.off('start cycle complete'); // $ExpectType Suite

// unregister all listeners for all event types
suite.off(); // $ExpectType Suite

// register a listener for an event type
suite.on('cycle', listener); // $ExpectType Suite

// register a listener for multiple event types
suite.on('start cycle', listener); // $ExpectType Suite

// basic usage
suite.run(); // $ExpectType Suite

// or with options
suite.run({ 'async': true, 'queued': true });
