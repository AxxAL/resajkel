import AdModel from "App/Models/AdModel";
import { RequestContract } from '@ioc:Adonis/Core/Request';
import { AuthContract } from "@ioc:Adonis/Addons/Auth";

export async function GetAllAds(): Promise<AdModel[]> {
    return AdModel.all();
}

export async function CreateNewAd(request: RequestContract, auth: AuthContract): Promise<AdModel> {
    const title: string = request.input("title");
    const author_id: number = auth.user?.id || 0;
    const price: number = request.input("price");
    const description: string = request.input("description");
    const image_url: string = request.input("imageurl");

    return AdModel.create({ title, author_id, price, description, image_url });
}