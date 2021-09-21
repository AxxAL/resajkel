import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { GetAllAds, CreateNewAd } from "App/Handlers/DatabaseHandler";
import AdModel from "App/Models/AdModel";

export default class AdController {
    public async All(ctx: HttpContextContract): Promise<string> {
        const { view } = ctx;

        const ads: AdModel[] = await GetAllAds();
        return view.render("ad/ad-list", { ads });
    }

    public async CreateForm(ctx: HttpContextContract): Promise<string> {
        const { auth, view } = ctx;

        await auth.use("web").authenticate();
        return view.render("ad/create-form");
    }

    public async CreatePost(ctx: HttpContextContract): Promise<void> {
        const { auth, request, response } = ctx;

        await auth.use("web").authenticate();
        if (!auth.user) return response.redirect("/");
        
        const ad = await CreateNewAd(request, auth);
        
        response.redirect(`/ad/${ad.id}`);
    }

    public async RemoveAd(ctx: HttpContextContract): Promise<void> {
        const { auth, params, response } = ctx;

        await auth.use("web").authenticate();
        if (!auth.user) return response.redirect("/");
        
        const id: number = params.id;
        
        await AdModel.findByOrFail("id", id).then(ad => {
            if (ad.author_id == auth.user?.id) ad.delete();
        });
        
        return ctx.response.redirect("/ad/my");
    }

    public async UserAds(ctx: HttpContextContract): Promise<string | void> {
        const { auth, view, response } = ctx;

        await auth.use("web").authenticate();
        if (auth.user == null) return response.redirect("/");
        
        const myAds: AdModel[] = await AdModel.query().where("author_id", auth.user?.id);
        
        return view.render("ad/my-ads", { ads: myAds });
    }
}