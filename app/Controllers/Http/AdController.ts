import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import AdModel from "App/Models/AdModel";
import UserModel from "App/Models/UserModel";
import { UploadImage } from "App/Handlers/FileHandler";
import { schema, rules } from "@ioc:Adonis/Core/Validator";

/**
 *  Logic for all ad routes.
 * Routes defined in /start/routers/AdRouter.ts
 */

export default class AdController {

    public async All(ctx: HttpContextContract): Promise<string> {
        const { view } = ctx;

        const ads: AdModel[] = await AdModel.all();
        return view.render("ad/ad-list", { ads });
    } // Returns view with all ads.

    public async CreateForm(ctx: HttpContextContract): Promise<string> {
        const { auth, view } = ctx;

        await auth.use("web").authenticate();
        return view.render("ad/create-form");
    } // Returns form for ad creation.

    public async CreatePost(ctx: HttpContextContract): Promise<void> {
        const { auth, request, response } = ctx;

        await auth.use("web").authenticate();

        // Validation schema for HTTP request body.
        const adSchema = schema.create({
            title: schema.string(),
            price: schema.number([ rules.range(1, 10000000) ]),
            description: schema.string(),
            image: schema.file()
        });
        const body = await request.validate({ schema: adSchema });

        // Separates unnecessary fields from necessary.
        let { image, ...payload } = body;

        // Add required fields to payload.
        Object.assign(payload, {
            author_id: auth.user?.id,
            image_url: await UploadImage(image, auth?.user)
        });
        
        const ad: AdModel = await AdModel.create(payload);
        return response.redirect(`/ad/${ad.id}`);
    } // Route to register new ad.

    public async RemoveAd(ctx: HttpContextContract): Promise<void> {
        const { auth, params, response } = ctx;

        await auth.use("web").authenticate();
        if (!auth.user) return response.redirect("/");
        
        const id: number = params.id;
        
        await AdModel.findByOrFail("id", id).then(ad => {
            if (ad.author_id == auth.user?.id) ad.delete();
        });
        
        return response.redirect("/ad/my");
    } // Removes specified ad.

    public async UserAds(ctx: HttpContextContract): Promise<string | void> {
        const { auth, view, response } = ctx;

        await auth.use("web").authenticate();
        if (auth.user == null) return response.redirect("/");
        
        const myAds: AdModel[] = await AdModel.query().where("author_id", auth.user?.id);
        
        return view.render("ad/my-ads", { ads: myAds });
    } // Returns view with logged in user's ads.

    public async Ad(ctx: HttpContextContract): Promise<string | void> {
        const { params, response, view } = ctx;

        const id: number = params.id;
        const ad: AdModel | null = await AdModel.findBy("id", id);
        if (ad == null) return response.redirect("/ad/all");
        const author: UserModel | null = await UserModel.findBy("id", ad.author_id);
        if (ad == null) return response.redirect("/ad/all");
        
        return view.render("ad/ad", { ad, author });
    } // Returns detailed view of specified ad.

}