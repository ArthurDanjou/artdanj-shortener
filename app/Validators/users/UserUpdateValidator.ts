import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from '@ioc:Adonis/Core/Validator'

export default class UserUpdateValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string.optional({ trim: true },
      [
        rules.email(),
        rules.unique(
          {
            table: 'users',
            column: 'email'
          })
      ]
    ),
    password: schema.string.optional({ trim: true },
      [
        rules.confirmed(),
        rules.minLength(8)
      ]
    )
  })

  public messages = {}
}
