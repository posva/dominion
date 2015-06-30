mongoose = require 'mongoose'
validate = require 'mongoose-validator'
console = require 'better-console'
bcrypt = require 'bcrypt'
SALT_WORK_FACTOR = 10

UserSchema = new mongoose.Schema
  token:
    type: String
  email:
    type: String
    validate: validate validator: 'isEmail'
  password:
    required: true
    type: String
  name:
    type: String
    required: true
    unique: true
  registered:
    type: Date
    default: Date.now
  lastConnection:
    type: Date
    default: Date.now

UserSchema.methods.comparePassword = (candidatePassword, cb) ->
  bcrypt.compare candidatePassword, @password, (err, isMatch) ->
    return cb err if err
    cb null, isMatch

UserSchema.static 'login', (userData, cb) ->
  if typeof userData is 'string' # token auth
    console.log "Login attempt with '#{userData}'"
    @findOne token: userData, (err, user) -> cb err, user?
  else
    console.log "Login attempt with '#{userData.name}' – '#{userData.password}'"
    @findOne name: userData.name, (err, user) ->
      if user?
        user?.comparePassword userData.password, cb
      else
        cb null, false

UserSchema.pre 'save', (next) ->
  @lastConnection = Date.now

  if @isModified 'password'
    bcrypt.genSalt SALT_WORK_FACTOR, (err, salt) =>
      return next err if err
      # hash the password using our new salt
      bcrypt.hash @password, salt, (err, hash) =>
        return next err if err
        # override the cleartext password with the hashed one
        @password = hash
        next()
  else
    next()

User = mongoose.model 'User', UserSchema

posva = new User
  email: 'posva13@gmail.com'
  password: 'posva'
  name: 'Posva'

# Create myself if I don't exist
posva.save()

User.create
  name: 'Sam'
  password: 'test'
  email: 'sam@posva.net'
, (err, user) ->
  console.error err if err and err.code isnt 11000

User.create
  name: 'Amy'
  password: 'test'
  email: 'amy@posva.net'
, (err, user) ->
  console.error err if err and err.code isnt 11000

User.login 'fsgdfgfsdgdsf',  (err, data) -> console.log "Login: #{data}"

module.exports = User
