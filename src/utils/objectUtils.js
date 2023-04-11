import session from 'express-session'
import MongoStore from 'connect-mongo'
import bCrypt from 'bcrypt'
import config from '../config/config.js'

function createOnMongoStore() {
  const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
  return session({
    store: MongoStore.create({
      mongoUrl:
        config.mongoRemote.cnxStr,
      mongoOptions: advancedOptions,
      ttl: 120,
      collectionName: 'sessions',
    }),
    secret: 'anarchy123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
}

function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password)
}

export default { createOnMongoStore, createHash, isValidPassword }

export const asPOJO = obj => JSON.parse(JSON.stringify(obj))

export const renameField = (record, from, to) => {
  record[to] = record[from]
  delete record[from]
  return record
}
export const removeField = (record, field) => {
  const value = record[field]
  delete record[field]
  return value
}