'use strict'
mongoose = require 'mongoose'
console = require 'better-console'

GameSchema = new mongoose.Schema
  host:
    type: mongoose.Schema.Types.ObjectId
    required: true
    ref: 'User'
  guests: [
    type: mongoose.Schema.Types.ObjectId
    ref: 'User'
  ]
  started: Date
  ended: Date

Game = mongoose.model 'Game', GameSchema

module.exports = Game
