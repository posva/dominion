express = require 'express'
app = express()
http = require('http').createServer app
io = require('socket.io') http
_ = require 'lodash'

app.use express.static './public'

players = []
games = []
io.on 'connection', (socket) ->
  console.log 'a user connected'
  socket.emit 'update',
    games: games
    players: players

  socket.on 'new game', (user) ->
    startNewGame socket, user

  socket.on 'join game', (user, game) ->
    joinGame socket, user, game

  socket.on 'reconnect', ->
    console.log 'user reconnected'
  socket.on 'disconnect', ->
    console.log 'user disconnected'
    userDisconnects socket

http.listen 3000, ->
  console.log 'listening on http://localhost:3000'

startNewGame = (socket, user) ->
  if not _.find(games, creator: socket.client.conn.id)
    games.push
      players: [
        name: user
        id: socket.client.conn.id
      ]
      creator: socket.client.conn.id
      status: 'waiting'
      maxPlayers: 4

    io.emit 'update',
      games: games

userDisconnects = (socket) ->
  rest = _.remove games,
    creator: socket.client.conn.id
    status: 'waiting'

  removed = false
  _.forEach games, (game) ->
    r = _.remove game.players, id: socket.client.conn.id
    if r.length
      removed = true

  if rest.length or removed
    io.emit 'update',
      games: games

joinGame = (socket, user, game) ->
  if socket.client.conn.id isnt game
    gameIns = _.find games, creator: game
    if gameIns?
      if not _.find(gameIns.players, id: socket.client.conn.id)
        gameIns.players.push
          name: user
          id: socket.client.conn.id
        io.emit 'update', games: games

