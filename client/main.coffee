Vue = require 'vue'
io = require 'socket.io-client'
_ = require 'lodash'

status = new Vue
  el: '#status'
  directives:
    disabled: (v) -> @el.disabled = !!v
  data:
    socket: null
    connecting: false
    user: 'Posva'
    password: 'posva'
    players: []
    games: []
    myGame: null
  methods:
    connect: ->
      @connecting = true
      if @socket?
        @socket.disconnect()
      else
        if @lastSocket?
          socket = @lastSocket.connect()
        else
          socket = io.connect()
          socket.on 'disconnect', =>
            @connecting = false
            console.log 'im out'
            @socket = null
            @lastSocket = socket
          socket.on 'connect', =>
            console.log 'Connecting'
            socket.emit 'authentication',
              name: @user
              password: @password
          socket.on 'unauthorized', =>
            @connecting = false
            console.log 'Auth Failed'
          socket.on 'authenticated', =>
            console.log 'Sucess!'
            @connecting = false
            @socket = socket
            initializeSocket.call this
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
