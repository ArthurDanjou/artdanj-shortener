import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Links extends BaseSchema {
  protected tableName = 'links'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('code').notNullable()
      table.string('target').notNullable()
      table.string('type').defaultTo('PERMANENT')
      table.timestamp('expire').defaultTo(this.now())
      table
        .integer('author_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
