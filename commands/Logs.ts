import {args, BaseCommand} from '@adonisjs/core/build/standalone'
import Link from "App/Models/Link";

export default class Logs extends BaseCommand {

  public static commandName = 'link:logs'

  public static description = 'Retrieves the number of visits of a link'

  public static aliases = ['link:stats', 'link:show']

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  @args.string({ description: 'Code of the new link' })
  public code: string

  public async run () {
    const link = await Link.findBy('code', this.code)
    if (!link) {
      this.logger.warning(`The link with code '${this.code}' does not exist!`)
      return
    }
    await link.load('clicks')
    const table = this.ui.table()
    table.head(['Id', 'IP', 'Country', 'Date'])

    link.clicks.forEach((click) => {
      table.row([
        `${click.id}`,
        click.ip,
        click.country.length == 0 ? this.colors.grey('Unknown') : click.country,
        click.date.toSQL()
      ])
    })

    table.render()
  }
}
