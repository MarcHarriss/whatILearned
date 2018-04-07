# JavaScipt

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<!--
███████ ████████ ██████  ██ ███    ██  ██████  ███████
██         ██    ██   ██ ██ ████   ██ ██       ██
███████    ██    ██████  ██ ██ ██  ██ ██   ███ ███████
     ██    ██    ██   ██ ██ ██  ██ ██ ██    ██      ██
███████    ██    ██   ██ ██ ██   ████  ██████  ███████
-->


## JS Strings

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### String basics

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

> this is a string in javascript

```javascript
var string = "This is a string";

```

### string.length

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

>  use .length to find the length of a string

```javascript
var string = "this is a string";
string.length //=> 16

```

### string CharCode()

fromCharCode() and charCode() both are for working with the corresponding UTF-16 units

I recently used this to decode Ceasars Cipher, the code on the right is the example,

```javascript
function rot13(str) { // LBH QVQ VG!
//create array to held encoded chars
  var joinAscii = [];
//create array to hold decoded chars
  var join = [];
// turn parameters into an array so we can loop
// through them.
  var split = str.split('');
// for each letter, return its corresponding value
  split.forEach(function(letter) {
    var encodedLetter = letter.charCodeAt();
// if statement only valid for working out Ceasars Cipher
// basically for the first half of the alphabet
// , we add 13 to the numerical value
// for the second half, we minus 13, and for all
// other values
// we leave, so spaces and punctuation stay the same
    if (encodedLetter >= 65 && encodedLetter <= 77) {
      encodedLetter += 13;
    } else if (encodedLetter >= 78 && encodedLetter <= 90) {
      encodedLetter -= 13;
    }
// push this letter into our array
    joinAscii.push(encodedLetter);
  });
// loop through new encoded array to convert
// back to standard chars
  joinAscii.forEach(function(number) {
    var decodedNumber = String.fromCharCode(number);
    join.push(decodedNumber);
    console.log("join: " + join);
  });

  // Like a newb, I struggled and wondered why
  // b.join(''); was working, until I realised
  // it isn't destructive and had to save it to
  // another variable hence, a
  var a = join.join('');
  console.log(a);

  return a;
}

// Change the inputs below to test
rot13("!LBH QVQ VG!");

```



<!--
 █████  ██████  ██████   █████  ██    ██ ███████
██   ██ ██   ██ ██   ██ ██   ██  ██  ██  ██
███████ ██████  ██████  ███████   ████   ███████
██   ██ ██   ██ ██   ██ ██   ██    ██         ██
██   ██ ██   ██ ██   ██ ██   ██    ██    ███████
-->


## JS Arrays

### sort

Seems like the sort function can be buggy so it should always be passed a cllback function that defines the order

> sort with callback function

```javascript
arr.sort(function(a, b){
  return a - b;
})
// this will sort is ascending order, b-a sort in descending order.
```

## JS Boolean

> So I learned that you can use .filter on arrays, and when you want to filter out all null values, we can use the Boolean object like so:

```javascript

  return arr.filter(Boolean);

```

<!--
███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████
██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██
█████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████
-->


## JS Functions

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### arguments

> Arguements are what are passed into the function when called for example

```javascript
function myFunc(firstArg, secondArg) {
  ...
}

```

> When creating the function, all the arguments are passed into an array like object - but we cant use it until we convert it into an array, like so:

```javascript
var args = Array.prototype.slice.call(arguments);

```

> We can then target specific arguments via bracket syntax:

```javascript
 var first = args[0];
 var second = args[1];

```

<!--
 ██████  ██████  ███████ ██████   █████  ████████  ██████  ██████  ███████
██    ██ ██   ██ ██      ██   ██ ██   ██    ██    ██    ██ ██   ██ ██
██    ██ ██████  █████   ██████  ███████    ██    ██    ██ ██████  ███████
██    ██ ██      ██      ██   ██ ██   ██    ██    ██    ██ ██   ██      ██
 ██████  ██      ███████ ██   ██ ██   ██    ██     ██████  ██   ██ ███████


███████ ██   ██ ██████  ██████  ███████ ███████ ███████ ██  ██████  ███    ██ ███████
██       ██ ██  ██   ██ ██   ██ ██      ██      ██      ██ ██    ██ ████   ██ ██
█████     ███   ██████  ██████  █████   ███████ ███████ ██ ██    ██ ██ ██  ██ ███████
██       ██ ██  ██      ██   ██ ██           ██      ██ ██ ██    ██ ██  ██ ██      ██
███████ ██   ██ ██      ██   ██ ███████ ███████ ███████ ██  ██████  ██   ████ ███████
-->


## Operators & Expressions

### Delete

We can remove an item from an array with delete, although it will leave null values behind that need to be filtered.

> delete from an array

```javascript
delete arr[i];

```
