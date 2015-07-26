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
  sam = genSocket 'Sam'
  beforeEach ->
    Match._reset()

  it 'should create a Match', ->
    debugger
    Match.canCreateGame socket
    .should.be.true()
    Match.canCreateGame socket
    .should.be.true()
    (-> new Match socket, maxPlayers: 4).should.not.throw()

  it 'should not create a game for the same player twice', ->
    Match.canCreateGame socket
    .should.be.true()
    (-> new Match socket, maxPlayers: 4).should.not.throw()
    Match.canCreateGame socket
    .should.be.false()

  it 'should be able to join a match', ->
    match = null
    (-> match = new Match socket, maxPlayers: 4).should.not.throw()
    match.canJoin sam
    .should.be.true()

  it 'should join a match', ->
    match = null
    (-> match = new Match socket, maxPlayers: 4).should.not.throw()
    err = null
    (-> err = match.join sam).should.not.throw()
    should.not.exist err

  it 'should not be able to join a match twice', ->
    match = null
    (-> match = new Match socket, maxPlayers: 4).should.not.throw()
    err = null
    (-> err = match.join sam).should.not.throw()
    should.not.exist err
    (-> err = match.join sam).should.not.throw()
    should.exist err

  it 'should not be able to join if there is no place', ->
    match = null
    (-> match = new Match socket, maxPlayers: 1).should.not.throw()
    err = null
    (-> err = match.join sam).should.not.throw()
    should.exist err

  it 'should not be able to join my own game', ->
    match = null
    (-> match = new Match socket, maxPlayers: 1).should.not.throw()
    err = null
    (-> err = match.join socket).should.not.throw()
    should.exist err

  it 'should not be able to join a started game', ->
    match = null
    (-> match = new Match socket, maxPlayers: 1).should.not.throw()
    err = null
    match.status = 'playing'
    (-> err = match.join sam).should.not.throw()
    should.exist err

  it 'should start a game only if I am the creator', ->
    match = null
    (-> match = new Match socket, maxPlayers: 2).should.not.throw()
    err = null
    (-> err = match.join socket).should.not.throw()
    (-> err = match.start sam).should.not.throw()
    match.status.should.be.eql 'waiting'
    should.exist err
    (-> err = match.start socket).should.not.throw()
    match.status.should.be.eql 'playing'
    should.not.exist err

  it 'should not start a game twice', ->
    match = null
    (-> match = new Match socket, maxPlayers: 1).should.not.throw()
    err = null
    (-> err = match.join socket).should.not.throw()
    (-> err = match.start socket).should.not.throw()
    match.status.should.be.eql 'playing'
    should.not.exist err
    (-> err = match.start socket).should.not.throw()
    match.status.should.be.eql 'playing'
