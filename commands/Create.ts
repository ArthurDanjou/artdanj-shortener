import {args, BaseCommand, flags} from '@adonisjs/core/build/standalone'
import {DateTime} from "luxon";
import Link from "App/Models/Link";
import User from "App/Models/User";
import Env from "@ioc:Adonis/Core/Env";

export default class Create extends BaseCommand {

  public static commandName = 'link:create'

  public static description = 'Quickly and easily create a new link'

  public static aliases = ['new']

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  @args.string({ description: 'Code of the new link' })
  public code: string

  @args.string({ description: 'Target of the new link' })
  public target: string

  @flags.string({ alias: 'd', description: 'Date of the new link (Format: yyyy-MM-dd/HH:mm:ss)' })
  public date: string

  public async run () {
    const exist = await Link.findBy('code', this.code)
    if (exist) {
      this.logger.warning(`The link with code '${this.code}' already exists!`)
      return
    }

    await Link.create({
      code: this.code,
      target: this.target,
      type: this.date ? 'TEMPORARY' : 'PERMANENT',
      expire: DateTime.fromJSDate(new Date(this.date || new Date())) ?? null,
      authorId: (await User.findByOrFail('email', Env.get('ADMIN_USER'))).id
    })
    this.logger.info(`The link '${this.colors.yellow(this.code)}' was successfully created!`)
  }
}
