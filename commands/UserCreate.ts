import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class UserCreate extends BaseCommand {

  /**
   * Command name is used to run the command
   */
  public static commandName = 'user:create'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Create the default user'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process
     */
    stayAlive: false,
  }

  public async run () {
    const { default: User } = await import('App/Models/User')
    const { default: Env } = await import('@ioc:Adonis/Core/Env')
    await User.firstOrCreate({
      email: Env.get('ADMIN_USER', 'admin@linkyjs.dev')
    }, {
      email: Env.get('ADMIN_USER', 'admin@linkyjs.dev'),
      password: Env.get('ADMIN_PASSWORD', 'password')
    })
    this.logger.info('User successfully created !')
  }
}
