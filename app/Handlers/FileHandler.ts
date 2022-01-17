import { MultipartFileContract }from "@ioc:Adonis/Core/BodyParser"
import UserModel from "App/Models/UserModel";
import Drive from "@ioc:Adonis/Core/Drive";
import { join } from "path";
import { rm } from "fs/promises";
import { Exception } from "@poppinss/utils";

/**
 * Uploads an image to the CMS.
 * @returns URL path to image.
 */
export async function UploadImage(file: MultipartFileContract | null, user: UserModel | undefined): Promise<string> {

    if (!file || !user) throw new Exception("Invalid file or user.");

    const randomNumber: number = Math.floor(Math.random() * 10000);

    const fileName: string = `userupload-${randomNumber}.${file.extname}`;

    await file.moveToDisk(`images/${user.id}`, {
        name: fileName,
        visibility: "public",
        contentType: "image"
    });

    return await Drive.getUrl(`images/${user.id}/${fileName}`);
}

/**
 * Deletes all images belonging to provided user. 
 */
export async function DeleteUserImages(user: UserModel): Promise<void> {
    if (!user) return;

    const userFilesPath: string = join(__dirname, "../../tmp/uploads/images", user.id);

    try {
        await rm(`${userFilesPath}`, { recursive: true });
    } catch(err) {
        throw new Exception("Couldn't delete user's images.");
    }
}