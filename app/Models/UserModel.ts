import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import { join } from "path";
import { rm } from "fs/promises";
import { Exception } from '@adonisjs/core/build/standalone';


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

  /**
   * This method deletes all usercontent and then the user itself.
   */
  public async obliterateMe(): Promise<void> {
    const userFilesPath: string = join(__dirname, "../../tmp/uploads/images", this.id);
    try {
      await rm(`${userFilesPath}`, { recursive: true });
    } catch(err) {
      throw new Exception("Couldn't delete user's images.");
    }
    this.delete();
  }

}
