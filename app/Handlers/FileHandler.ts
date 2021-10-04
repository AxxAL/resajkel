import { MultipartFileContract }from "@ioc:Adonis/Core/BodyParser"
import UserModel from "App/Models/UserModel";
import Drive from "@ioc:Adonis/Core/Drive";

/**
 * Uploads an image to the CMS.
 * @returns URL path to image.
 */
export async function UploadImage(file: MultipartFileContract | null, user: UserModel | undefined): Promise<string> {

    if (!file || !user) return "";

    const randomNumber: number = Math.floor(Math.random() * 10000);

    const fileName: string = `userupload-${randomNumber}.${file.extname}`;

    await file.moveToDisk(`images/${user.id}`, {
        name: fileName,
        visibility: "public",
        size: "8mb",
        extnames: [ "png", "jpg", "jpeg" ],
        contentType: "image"
    });

    return await Drive.getUrl(`images/${user.id}/${fileName}`);
}