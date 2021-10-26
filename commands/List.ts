import { BaseCommand } from '@adonisjs/core/build/standalone'
import Link from "App/Models/Link";

export default class List extends BaseCommand {

  public static commandName = 'link:list'

  public static description = 'List all your links'

  public static aliases = ['link:ls']

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run () {
    const table = this.ui.table()
    table.head(['Id', 'Code', 'Target', 'Clicks count', 'Author', 'Type', 'Expire'])

    const links = await Link
      .query()
      .preload('clicks')
      .preload('author')
      .orderBy('id', 'asc')
    links.forEach((link) => {
      table.row([
        `${link.id}`,
        link.code,
        link.target,
        link.clicks.length > 0 ? this.colors.yellow(String(link.clicks.length)) : this.colors.grey('0'),
        link.author.email,
        link.type,
        link.type === 'TEMPORARY' ? link.expire!.toSQL() : this.colors.grey('Never')
      ])
    })

    table.render()
  }
}
