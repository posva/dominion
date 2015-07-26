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
io.on 'connection', (socket) ->
  socket.on 'reconnect', ->
    console.log 'User reconnected'
  socket.on 'disconnect', ->
    console.log 'User disconnected'
    # Update last connection time
    #userDisconnects socket

ioAuth io,
  authenticate: (data, cb) -> User.login data, cb
  postAuthenticate: (socket, data) ->
    console.log 'User connected', data
    socket.user =
      name: data.name
    socket.emit 'update',
      matches: Match.getMatches()
      players: players

    socket.on 'new game', ->
      newGame socket

    socket.on 'join game', (user) ->
      joinGame socket, user

    socket.on 'start game', (user) ->
      startGame socket, user

http.listen port, ->
  console.info "Listening on http://localhost:#{port}"

newGame = (socket) ->
  if Match.canCreateGame socket
    new Match socket, maxPlayers: 4
    io.emit 'update',
      matches: Match.getMatches()

# TODO must be changed
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
      matches: Match.getMatches()

joinGame = (socket, user) ->
  if user of Match.matches
    match = Match.matches[user]
    err = match.join socket
    if err
      console.error err
    else
      io.emit 'update', matches: Match.getMatches()

startGame = (socket, user) ->
  if user of Match.matches
    match = Match.matches[user]
    err = match.start socket
    if err
      console.error err
    else
      io.emit 'update', matches: Match.getMatches()
