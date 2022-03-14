import Ad from "App/Models/Ad";
import User from "App/Models/User";
import { UploadImage } from "App/Handlers/FileHandler";
import { schema, rules } from "@ioc:Adonis/Core/Validator";

/**
 *  Logic for all ad routes.
 * Routes defined in /start/routers/AdRouter.ts
 */

export default class AdController {

    public async All({ view }): Promise<string> {
        const ads: Ad[] = await Ad.all();
        return view.render("ad/ad-list", { ads });
    } // Returns view with all ads.

    public async CreateForm({ auth, view }): Promise<string> {
        await auth.use("web").authenticate();
        return view.render("ad/create-form");
    } // Returns form for ad creation.

    public async CreatePost({ auth, request, response }): Promise<void> {
        await auth.use("web").authenticate();

        // Validation schema for HTTP request body.
        const adSchema = schema.create({
            title: schema.string(),
            price: schema.number([ rules.range(1, 10000000) ]),
            description: schema.string(),
            image: schema.file({ size: "8mb", extnames: ["png", "jpg", "jpeg"] })
        });
        const body = await request.validate({ schema: adSchema });

        // Separates unnecessary fields from necessary.
        let { image, ...payload } = body;

        let image_url: string;
        try {
            image_url = await UploadImage(image, auth?.user);
        } catch(err) {
            image_url = "/assets/images/image-not-found.png";
        }

        // Add required fields to payload.
        Object.assign(payload, {
            author_id: auth.user?.id,
            image_url
        });

        await Ad.create(payload);
        return response.redirect("/ad/my");
    } // Route to register new ad.

    public async RemoveAd({ auth, params, response }): Promise<void> {
        await auth.use("web").authenticate();
        if (!auth.user) return response.redirect("/");
        
        const id: number = params.id;
        
        await Ad.findByOrFail("id", id).then(ad => {
            if (ad.author_id == auth.user?.id) {
                ad.delete();
            }
        });
        
        return response.redirect("/ad/my");
    } // Removes specified ad.

    public async UserAds({ auth, view, response }): Promise<string | void> {
        await auth.use("web").authenticate();
        if (auth.user == null) return response.redirect("/");
        
        const ads: Ad[] = await Ad.query()
            .where("author_id", auth.user?.id);
        
        return view.render("ad/my-ads", { ads });
    } // Returns view with logged in user's ads.

    public async Ad({ params, response, view }): Promise<string | void> {
        const id: string = params.id;

        const ad: Ad | null = await Ad.findBy("id", id);
        if (ad == null)
            return response.redirect("/ad/all");;

        const author: User | null = await User.findBy("id", ad.author_id);
        if (author == null)
            return response.redirect("/ad/all");
        
        return view.render("ad/ad", { ad, author });
    } // Returns detailed view of specified ad.

}