import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Link from "App/Models/Link";

export default class Click extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public linkId: number

  @belongsTo(() => Link)
  public link: BelongsTo<typeof Link>

  @column()
  public country: string

  @column()
  public ip: string

  @column.dateTime({ autoCreate: true })
  public date: DateTime
}
