'use strict'
_ = require 'lodash'
console = require 'better-console'

class Match
  constructor: (socket, options) ->
    {@maxPlayers} = options
    @creator = socket.user.name
    @players = [
      name: socket.user.name
      id: socket.client.conn.id
    ]
    @status = 'waiting'
    Match.matches[@creator] = this

  # Static methods and vars
  @matches: {}
  @canCreateGame: (socket) -> socket.user.name not of @matches
  @removeGame: (socket) ->
  @joinGame: (socket, game) ->
  @startGame: (socket, game) ->

  # For testing
  @_reset: ->
    @matches = {}

module.exports = Match
