Vue = require 'vue'
io = require 'socket.io-client'
_ = require 'lodash'

status = new Vue
  el: '#status'
  data:
    socket: null
    connecting: 'disabled'
    user: 'Ed'
    players: []
    games: []
    myGame: null
  methods:
    connect: ->
      @connecting = 'disabled'
      if @socket?
        @socket.disconnect()
      else
        socket = io.connect()
        socket.on 'connect', =>
          @socket = socket
          @connecting = false
          initializeSocket.call @
          console.log 'im in'
        socket.on 'disconnect', =>
          @connecting = false
          console.log 'im out'
          @socket = null
    newGame: ->
      @socket.emit 'new game', @user
    join: (id) ->
      @socket.emit 'join game', @user, id

initializeSocket = ->
  that = @
  @socket.on 'update', (data) ->
    console.log data
    keys = [
      'games'
      'players'
    ]
    _.forEach keys, (key) ->
      if key of data
        that[key] = data[key]
