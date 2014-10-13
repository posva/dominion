DOMINION
===
[![Build Status](https://travis-ci.org/posva/dominion.svg?branch=master)](https://travis-ci.org/posva/dominion)
[![Coverage Status](https://img.shields.io/coveralls/posva/dominion.svg)](https://coveralls.io/r/posva/dominion)
[![Dependency Status](https://david-dm.org/posva/dominion.svg)](https://david-dm.org/posva/dominion)
[![devDependency Status](https://david-dm.org/posva/dominion/dev-status.svg)](https://david-dm.org/posva/dominion#info=devDependencies)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/posva/dominion?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Dominion is a board card game based on building a deck and getting victory points.
You can play it online at [playdominion.com](http://playdominion.com).

This is a learning project. By that I mean I'm willing to learn some technologies like `nodejs` and how to develop things around it. This includes testing(`mocha`, `should`), continuous integration(`travis`, `coveralls`) and also prototypal JavaScript (`selfish`).

Therefore I may never end this project. You should not take this as an example.

# Building

You need `grunt` to launch the different tasks (install with `npm install -g grunt-cli`).
Then you just have to do:

```
npm install
grunt
```

## Notes

When optimizing with `r.js` (`grunt deploy`), `selfish` is not up to date. Therefore line 6 must be changed with this:
```js
!(typeof define !== "function" ? function(selfish, $){ $(null, typeof exports !== 'undefined' ? exports : window); } : define)('selfish', function(require, exports) {
```


# Tasks

* `deploy`: build with `r.js`
* `test`: launch the tests
* `serve`: launch a local server
* `jshint`: lint js code
* `coverage`: launch the coverage test

# Coding Style

* Indentation: 2 spaces
* Braces: at the end of the line like
```
if (test) {
  do();
}
```
* Protoypes: start with Upper Case. ex: `var cafe = Cafe.new()`
* Globals: add them to the `globals.js` file

# License

This code is distributed under the MIT License.

# Technologies that are going to be used

* Phaser for display in clent
* nodejs for server and client application

# Copyright

The original game [Dominion](http://en.wikipedia.org/wiki/Dominion_(card_game)) was created by Donald X. Vaccarino and published by Rio Grande Games.
The online version [playdominion.com](http://playdominion.com) was developed by Goko (I think :no_mouth:).
Any picture used for the cards belong to them and do not apply to the project Licence (which is not defined yet)
