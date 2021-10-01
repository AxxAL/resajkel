import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser';
import UserModel from 'App/Models/UserModel';
import Drive from '@ioc:Adonis/Core/Drive';

export default class CmsController {
    public async UploadImage(ctx: HttpContextContract): Promise<boolean> {
        const { request } = ctx;

        const file: MultipartFileContract | null = request.file("file", {
            size: "8mb",
            extnames: [ "png", "jpg", "jpeg" ]
        });

        return true;
    }
}
