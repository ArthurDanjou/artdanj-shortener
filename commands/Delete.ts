import {args, BaseCommand} from '@adonisjs/core/build/standalone'
import Link from "App/Models/Link";

export default class Delete extends BaseCommand {

  public static commandName = 'link:delete'

  public static description = 'Delete an existing link'

  public static aliases = ['del', 'remove', 'rem']

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
    await link.related('author').dissociate()
    await link.delete()
    this.logger.info(`The link '${this.colors.yellow(link.code)}' was successfully deleted!`)
  }
}
