import {args, BaseCommand, flags} from '@adonisjs/core/build/standalone'
import Link from "App/Models/Link";
import {DateTime} from "luxon";

export default class Update extends BaseCommand {

  public static commandName = 'link:update'

  public static description = 'Update an existing link'

  public static aliases = ['set']

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  @args.string({ description: 'Code of the new link' })
  public code: string

  @flags.string({ name: 'code', description: 'The new code of the link' })
  public new_code: string

  @flags.string({ description: 'The new target of the link' })
  public target: string

  @flags.string({ description: 'The new expiration date of the link' })
  public expire: string

  public async run () {
    const link = await Link.findBy('code', this.code)
    if (!link) {
      this.logger.warning(`The link with code '${this.code}' does not exist!`)
      return
    }
    if (this.target) {
      link.target = this.target
      const clicks = await link.related('clicks').query()
      clicks.forEach(click => click.delete())
    }
    if (this.new_code) link.code = this.new_code
    if (this.expire) {
      (this.expire == 'PERMANENT'.toLowerCase() || this.expire == 'PERM'.toLowerCase()) ? link.type = 'PERMANENT' : link.type = 'TEMPORARY'
      link.expire = DateTime.fromJSDate(new Date(this.expire || new Date())) ?? null
    }
    await link.save()
    this.logger.info('The link was successfully updated!')
  }
}
