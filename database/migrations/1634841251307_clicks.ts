import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Clicks extends BaseSchema {
  protected tableName = 'clicks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('link_id')
        .unsigned()
        .references('links.id')
        .onDelete('CASCADE')
      table.string('country')
      table.string('ip')
      table.timestamp('date').defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
