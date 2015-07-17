'use strict'
_ = require 'lodash'
console = require 'better-console'
Base = require('selfish').Base

class Match
  constructor: (@creator) ->
    @players = []

  # Static methods and vars
  @matches: []

module.exports = Match
