import {
  BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import {DateTime} from "luxon";
import User from "App/Models/User";
import Click from "App/Models/Click";

export default class Link extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public code: string

  @column()
  public target: string

  @column()
  public authorId: number

  @belongsTo(() => User, {
    foreignKey: 'authorId'
  })
  public author: BelongsTo<typeof User>

  @column()
  public type: 'TEMPORARY' | 'PERMANENT'

  @column.dateTime()
  public expire: DateTime | null

  @hasMany(() => Click)
  public clicks: HasMany<typeof Click>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
