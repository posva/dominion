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

 WIP

# gulp Tasks

* `test`: tests + coverage
* `eslint:src`: lint js code

# Coding Style

Coding style is mostly 1TBS.

* Indentation: 2 spaces
* Curly braces: at the end of the line
* Protoypes: start with Upper Case. ex: `var cafe = Cafe.new()`, instances with lower case
* Globals: add them to the `globals.js` file. You can check global leaks with `mocha --check-leaks`

# License

This code is distributed under the MIT License.

# Technologies that are going to be used

* Phaser for display in clent
* nodejs for server and client application

# Copyright

The original game [Dominion](http://en.wikipedia.org/wiki/Dominion_(card_game)) was created by Donald X. Vaccarino and published by Rio Grande Games.
The online version [playdominion.com](http://playdominion.com) was developed by Goko (I think :no_mouth:).
Any picture used for the cards belong to them and do not apply to the project Licence.
