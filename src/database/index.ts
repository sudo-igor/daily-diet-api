import { knex } from 'knex'
import path from 'node:path'

export const config = {
  client: 'better-sqlite3',
  connection: {
    filename: path.resolve(__dirname, '../../db/app.db')
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, '../../db/migrations')
  }
}

export const db = knex(config)
