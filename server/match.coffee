'use strict'
_ = require 'lodash'
console = require 'better-console'

# Class for matches
#
# Every created match is added to the matches Array
class Match
  # @property [Number] Number of maximum players
  maxPlayers: 4
  # @property [String] Username of the creator
  creator: ''
  # @property [Array<Object>] players Players who have joined the game plus
  # the creator
  players: []
  # @property [String] Status of the Match
  status: ''

  # Creates a match
  # @param [Socket] socket Socket creating the game
  # @param [Options] options Game options
  # @option options [Number] maxPlayers Number of maximum players
  constructor: (socket, options) ->
    {@maxPlayers} = options
    @maxPlayers ?= 4
    @creator = socket.user.name
    @players = [
      name: socket.user.name
      id: socket.client.conn.id
    ]
    # @property [String] Status of the Match
    @status = 'waiting'
    Match.matches[@creator] = this

  # Check if a given socket can join the match
  # @param [Socket] socket Socket wanting to join
  # @return [Boolean] Returns whether the given socket can join or not
  canJoin: (socket) ->
    @creator isnt socket.user.name and @players.length < @maxPlayers and
      @status is 'waiting' and _.findIndex(@players, 'name', socket.user.name) < 0

  # Make a socket join the match if it cans
  # @param [Socket] socket Socket joining
  # @return [Object] Returns errors if there are any
  join: (socket) ->
    if @canJoin socket
      @players.push
        name: socket.user.name
        id: socket.client.conn.id
      null
    else
      name: 'Join'
      message: "Cannot join #{@creator}'s game"

  # Start a game. Can only be done by the creator
  # @param [Socket] socket Socket starting the game
  # @return [Object] Returns errors if there are any
  start: (socket) ->
    if @creator is socket.user.name
      if @status is 'waiting'
        @status = 'playing'
        null
      else
        name: 'Start'
        message: "#{@creator}'s game has already started"
    else
      name: 'Start'
      message: "You cannot start #{@creator}'s game"

  # Static methods and vars
  # All on going matches ordered by username
  @matches: {}
  # Check whether a given socket can create a new match
  # @param [Socket] socket Socket checking if it can create a game
  # @return [Boolean] Returns whether the given socket can create a game or not
  @canCreateGame: (socket) -> socket.user.name not of @matches
  @removeGame: (socket) ->

  # Get matches as a view (with no functions and removing any useless data)
  # @return [Array<Object>] Array of matches
  @getMatches: ->
    _.map @matches, (match) ->
      _.pick match, ['creator', 'players', 'status', 'maxPlayers']

  # For testing
  @_reset: ->
    @matches = {}

module.exports = Match
