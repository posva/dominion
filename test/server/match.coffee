'use strict'
should = require 'should'
Match = require '../../server/match'

describe '#Match', ->
  genSocket = (user) ->
    client:
      conn:
        id: +(Math.random() * 10000)
    user:
      name: user
  socket = genSocket 'Posva'
  beforeEach ->
    Match._reset()

  it 'should create a Match', ->
    debugger
    Match.canCreateGame socket
    .should.be.true()
    Match.canCreateGame socket
    .should.be.true()
    (-> new Match socket, maxPlayers: 4).should.not.throw()

  it 'should prevent creating a game for the same player twice', ->
    Match.canCreateGame socket
    .should.be.true()
    (-> new Match socket, maxPlayers: 4).should.not.throw()
    Match.canCreateGame socket
    .should.be.false()
