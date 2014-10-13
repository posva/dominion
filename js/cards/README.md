Cards
===

Here goes the code for every card.
Common cards like copper and estates appear at root while other cards appear within a folder named after the expansion they belong.
For instance Harem belong to The Intrigue and must be placed in a folder named `the-intrigue`.

The rules for naming are:
* Don't use `'`, just ignore it, the cards have a name attribute
* Replace spaces with `-`
* lower case for every name in js files

# Creating cards

When creating cards you must know about some useful functions and parameters:

* `setup(game)`: anything related to setup. This is before the game starts. Set to null by default.
* `money(game)` and `points(game)`: return the money for a Treasure card or the number of points for a Victory card.

The `game` parameter is passed to most of calls and contains the game instance. This way you can access to any feature such as `currentPlayer` and so on.

TODO doc for game

## Cards text

Every card have a text variable that represent what is actually written on the card.
There are many symbols in order to display special elements such as the money picture

## Creating Victory
## Creating Treasure
## Creating Actions
### Events

Events are simple actions that doesn't need user interaction:

* +X Actions
* +X Buys
* +X Cards
* +X G (money)
* +X Buys

Whenever an action needs to do these things you should try to use them as they'll be used by the IA (not developed yet) in order to determine which action must be played.

Events are created by passing the game instance and a string defining the event itself:

```
Event.new(game, 'cards 2'); // + 2 Cards
Event.new(game, 'actions 2'); // + 2 Actions
Event.new(game, 'money 2'); // + 2 G
Event.new(game, 'buys 2'); // + 2 buys
```

## Mixing cards


