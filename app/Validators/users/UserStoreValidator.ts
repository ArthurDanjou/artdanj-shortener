import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from '@ioc:Adonis/Core/Validator'

export default class UserStoreValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.required(),
      rules.unique({
        table: 'users',
        column: 'email'
      })
    ]),
    password: schema.string({ trim: true },
      [
        rules.confirmed()
      ]
    )
  })

  public messages = {}
}
