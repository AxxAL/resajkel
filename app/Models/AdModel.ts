import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class AdModel extends BaseModel {

  @column({ isPrimary: true })
  public id: string;

  @column()
  public title: string;

  @column()
  public author_id: string;

  @column()
  public price: number;

  @column()
  public description: string;

  @column()
  public image_url: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async createId(adModel: AdModel) {
    adModel.id = uuidv4();
  } // Generates a UUID before saving ad to database.

}