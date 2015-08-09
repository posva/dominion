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
    name: 'Posva'
    password: 'posva'
    players: []
    matches: []
    myGame: null
  methods:
    connect: (event) ->
      @connecting = true
      if @socket?
        @socket.disconnect()
      else
        event.preventDefault()
        if @lastSocket?
          socket = @lastSocket.connect()
        else
          try
            socket = io.connect()
          catch err
            console.log 'Error connecting to socket:', err
            console.log 'Retrying'
            socket.connect()
          socket.on 'disconnect', =>
            @connecting = false
            console.log 'im out'
            @socket = null
            @lastSocket = socket
          socket.on 'connect', =>
            console.log 'Connecting'
            socket.emit 'authentication',
              name: @name
              password: @password
          socket.on 'unauthorized', =>
            @connecting = false
            console.log 'Auth Failed'
          socket.on 'authenticated', =>
            console.log 'Authenticated!'
            @connecting = false
            @socket = socket
            initializeSocket.call this
    newGame: ->
      @socket.emit 'new game'
    join: (id) ->
      @socket.emit 'join game', id
    start: (id) ->
      @socket.emit 'start game', id

initializeSocket = ->
  return if @socket.initialized
  @socket.initialized = true
  that = this
  @socket.on 'update', (data) ->
    console.log data
    keys = [
      'matches'
      'players'
    ]
    _.forEach keys, (key) ->
      if key of data
        that[key] = data[key]
