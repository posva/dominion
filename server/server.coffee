'use strict'
express = require 'express'
app = express()
http = require('http').createServer app
io = require('socket.io') http
_ = require 'lodash'
console = require 'better-console'
bcrypt = require 'bcrypt'
ioAuth = require 'socketio-auth'
Match = require './match'

mongoose = require 'mongoose'
User = require './user'
Game = require './game'

mongoURL = process.env.MONGOLAB_URI or 'mongodb://localhost/dominion'
mongoose.connect mongoURL
port = process.env.PORT or 3000

db = mongoose.connection

db.on 'error', ->
  console.error 'MongoDB connection failed', arguments

db.once 'open', ->
  console.info 'Connected to MongoDB'
  User.find().limit(3).select _id: true
  .exec (err, users) ->
    unless users.length isnt 3
      Game.create
        host: users[0].id
        guests: [
          users[1].id
          users[2].id
        ]
      , ->
        Game.findOne().populate('host guests').exec (err, game) ->
          console.log game

app.use express.static './public'

players = []
games = []
io.on 'connection', (socket) ->
  socket.on 'reconnect', ->
    console.log 'User reconnected'
  socket.on 'disconnect', ->
    console.log 'User disconnected'
    # Update last connection time
    userDisconnects socket

ioAuth io,
  authenticate: (data, cb) -> User.login data, cb
  postAuthenticate: (socket, data) ->
    console.log 'User connected', data
    socket.user =
      name: data.name
    socket.emit 'update',
      games: games
      players: players

    socket.on 'new game', ->
      newGame socket

    socket.on 'join game', (game) ->
      joinGame socket, game

    socket.on 'start game', (game) ->
      startGame socket, game

http.listen port, ->
  console.info "listening on http://localhost:#{port}"

newGame = (socket) ->
  if not _.find(games, creator: socket.client.conn.id)
    games.push
      players: [
        name: socket.user.name
        id: socket.client.conn.id
      ]
      creator: socket.client.conn.id
      creatorName: socket.user.name
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

joinGame = (socket, game) ->
  if socket.client.conn.id isnt game
    gameIns = _.find games,
      creator: game
      status: 'waiting'
    if gameIns? and gameIns.players.length < gameIns.maxPlayers
      if not _.find(gameIns.players, id: socket.client.conn.id)
        gameIns.players.push
          name: socket.user.name
          id: socket.client.conn.id
        io.emit 'update', games: games

startGame = (socket, game) ->
  if socket.client.conn.id is game
    gameIns = _.find games,
      creator: game
      status: 'waiting'
    if gameIns? and gameIns.players.length > 1
      gameIns.status = 'playing'
      io.emit 'update', games: games

