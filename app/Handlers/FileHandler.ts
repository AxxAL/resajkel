import { MultipartFileContract }from "@ioc:Adonis/Core/BodyParser"
import UserModel from "App/Models/UserModel";
import Drive from "@ioc:Adonis/Core/Drive";

export async function UploadImage(file: MultipartFileContract | null, user: UserModel | undefined): Promise<string> {

    if (!file || !user) return "";

    const fileName: string = `userupload-u[${user?.id}]-${file.fileName}.${file.extname}`;

    await file.moveToDisk("images", {
        name: fileName,
        visibility: "public",
        contentType: "image"
    });

    return await Drive.getUrl(`images/${fileName}`);
}