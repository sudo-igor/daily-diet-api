import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.decimal('weight', 5, 2).nullable()
    table.decimal('height', 5, 2).nullable()
    table.text('goal').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('weight')
    table.dropColumn('height')
    table.dropColumn('goal')
  })
}
