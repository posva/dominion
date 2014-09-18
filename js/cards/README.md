Cards
===

Here goes the code for every card.
Common cards like copper and estates appear at root while other cards appear within a folder named after the expansion they belong.
For instance Harem belong to The Intrigue and must be placed in a folder named `the-intrigue`.

The rules for naming are:
* Don't use `'`, just ignore it, the cards have a name attribute
* Replace spaces with `-`
* lower case for every name

# Creating cards

When creating cards (existant or not) you must know about some usefull functions and parameters:

* `setup(game)`: anything related to setup. This is before the game starts
* `money(game)` and `points(game)`: return the money for a Treasure card or the number of points for a Victory card.

The `game` parameter is passed to most of calls and contains the game instance. This way you can acces to any feature such as `currentPlayer` and so on.
