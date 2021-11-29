import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class UserModel extends BaseModel {

  @column({ isPrimary: true })
  public id: string;

  @column()
  public email: string;

  @column()
  public phonenumber: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public firstname: string;

  @column()
  public rememberMeToken?: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(userModel: UserModel) {
    if (userModel.$dirty.password) userModel.password = await Hash.make(userModel.password)
  } // Hashes password before saving user to database.

  @beforeSave()
  public static async createId(userModel: UserModel) {
    userModel.id = uuidv4();
  }// Generates a UUID before saving user to database.

}
