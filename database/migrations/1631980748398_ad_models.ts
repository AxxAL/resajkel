import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Ads extends BaseSchema {
  protected tableName = 'ad_models'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id')
      table.string("title")
      table.string("author_id")
      table.integer("price")
      table.string("description")
      table.string("image_url")
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
