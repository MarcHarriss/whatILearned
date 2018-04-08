# RxJS

This is a quick introduction into the concept of Reactive Programming in Angular with RxJS.

The subject of Reactive Programming is large enough to warrant it’s own course and indeed there are a number of books and courses which deal with nothing other than reactive programming with RxJS.
So the goal of this section isn’t to give you a complete understanding, the goal is to demystify the concepts so you understand what it is and where you can learn more.
Angular uses RxJS for some parts of it’s internal functioning. If you want you can also choose to use RxJS but you don’t need to at all.

## Basics

### Streams

#### Streams are a sequence of values over time, that’s it.

For example a number that goes up by 1 every second might have a stream that looks like

`[0,1,2,3,4]`

Another stream might be a sequence of x and y positions of mouse click events, like so:

`[(12,34), (345,22), (1,993)]`

We could even have a stream to represent a user filling in a form on a website. We could have a stream to represent each keypress, like so:

`[
  "A",
  "s",
  "i",
  "m"
]`

Or we could have a stream which contains a json representation of the whole form as the user enters data, like so:

`[
    { "name": "A" },
    { "name": "As" },
    { "name": "Asi" },
    { "name": "Asim" }
]`

We could have a stream for:
• The x,y position of the mouse as it moves around the screen in a HTML5 game. • The data returned from a real-time websockets connection.
• The chat windows opened by this user in a browser.
The more you think about it the more everything we do with a web application can be thought of as a stream.

### What is Reactive Programming?

Reactive programming is the idea that you can create your entire program just by defining the different streams and the operations that are performed on those streams.
As a concept that is easy to write, but how can we actually train our mind to program reactively? To explain this lets convert a simple imperative function into a reactive one.

<aside class="notice">
Imperative programming is a programming paradigm that you probably have been using so far in your career, it’s by far the most common and it’s involves executing statements that change a programs state, i.e. call functions that change the values of variables.
To get a good overview of the different programming paradigms read this article - https://en.wikipedia.org/wiki/Comparison_of_programming_paradigms
</aside>

> let's convert an imperative function to Reactive programming

```javascript
add ( A,B )  {
  return A + B;
}

// converts to ->

C = add(1, 2);
C = add(1, 4);
```

Now if we push some numbers onto stream A and B, the add operation is automatically called, calculating the sum of 4 and pushing it onto stream C.
If stream C was connected to another stream via another operation, that operation would then be called automatically as well.

With reactive programming we don’t call functions, we just define how our application is plumbed together and start pushing values onto streams and let the plumbing and operations handle the rest.
So if later on the value of B changes, we simply push the new value onto the stream B and then let the plumbing handle the rest, like so:


<aside class="success">
An analogy which works for me is to think about reactive programming as plumbing. We decide which pipes we need in our application, we decide how those pipes are connected together and then we turn on the water and sit back.
</aside>

### Observables

Streams so far are just a concept, an idea.
We link streams together using operators, so in in our previous example the add function is an
operation, specifically it’s an operation which combines two streams to create a third.
Observables is a new primitive type which acts as a blueprint for how we want to create streams, subscribe to them, react to new values, and combine streams together to build new ones.
It’s currently in discussion whether or not Observables make it into the ES7 version of JavaScript. We are still trying to roll out ES6 so even if it makes it, it will be many years before ES7 becomes
something we can code with natively.
Until then we need to use a library that gives us the Observable primitive and that’s where RxJS comes in.

<aside class="notice">
RxJS stands for Reactive Extensions for JavaScript, and its a library that gives us an implementation of Observables for JavaScript.
</aside>

### Library

Let’s explain RxJS by working through a simple example.
To reduce file size the RxJS library is broken up into many different parts, one main one and one
 Observables might become a core part of the JavaScript language in the future, so we can think of RxJS as a placeholder for when that arrives.
for each operation you want to use.
For our example we’ll add the rx.all.js library which contains all the operators. We create a simple index.html file and add the rx.all.js library in via a script tag.

> to include via CDN

```HTML
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/4.1.0/rx.all.js"></script>
</head>
```

### Interval

> The first thing we need to to is get an instance of an RxJS Observable, we do this like so:

```javascript
let obs = Rx.Observable;
```

An observable isn’t a stream. An observable is a blueprint which describes a set of streams and how they are connected together with operations.
I want our observable to create a single stream and push onto that stream a number every second, incremented by 1.

> With RxJS to define an observable to achieve the above we would use the operator interval, like so:

```javascript
let obs = Rx.Observable
      .interval(1000); //=> number of milliseconds between each push of the number onto the stream  
```

> In RxJS operators act on an observable and return an observable with the operator applied, so we can chain operators together creating an Observable Chain, like so:

```javascript
let obs = Rx.Observable
      .operator1();
      .operator2();
      .operator3();
      .operator4();
      .operator5();
```

### Subscribe

<aside class="notice">
In RxJS land no one can hear you stream, unless you subscribe.
</aside>

This observable is cold, that means it’s not currently pushing out numbers.
The observable will become hot and start pushing numbers onto it’s first stream, when it gets it’s first subscriber, like so:

```javascript
let obs = Rx.Observable
      .interval(1000);
  obs.subscribe(value => console.log("Subscriber: " + value));
```

By calling subscribe onto an observable it:
1. Turns the observable hot so it starts producing.
2. Lets us pass in a callback function so we react when anything is pushed onto the final stream in the observable chain.
Our application now starts printing out:

```javascript
  Subscriber: 0
  Subscriber: 1
  Subscriber: 2
  Subscriber: 3
  Subscriber: 4
  Subscriber: 5
  Subscriber: 6
  Subscriber: 7
  Subscriber: 8
  Subscriber: 9
  Subscriber: 10
```

### Take

But it just keeps on printing, forever, we just want the first 3 items so we use another operator called take.
We pass to that operator the number of items we want to take from the first stream. It creates a second stream and only pushes onto it the number of items we’ve requested, like so:

```javascript
let obs = Rx.Observable
      .interval(1000)
      .take(3);
  obs.subscribe(value => console.log("Subscriber: " + value));
```

now it only prints the first 3 subscribers and then stops

### Map

Finally I want to add another operator called map, this takes as input the output stream from take, convert each value to a date and pushes that out onto a third stream like so:

```javascript
let obs = Rx.Observable
      .interval(1000)
      .take(3)
      .map((v) => Date.now()); // This now prints out the time in milliseconds
// like so Subscriber: 1475506794287
  obs.subscribe(value => console.log("Subscriber: " + value));
```
