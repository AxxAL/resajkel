import Route from '@ioc:Adonis/Core/Route';
import AdModel from 'App/Models/AdModel';
import UserModel from 'App/Models/UserModel';

Route.get("/api/ad/all", async ({ response }) => {
    return response.send(await AdModel.all());
});

Route.get("/api/ad/:id", async ({ params, response }) => {
    const id: number = params.id;
    const ad: AdModel | null = await AdModel.findBy("id", id);
    if (ad == null) return response.redirect("/ad/all");
    const author: UserModel | null = await UserModel.findBy("id", ad.author_id);
    return response.json({ ad, author });
});

Route.get("/api/ad/search/:query", async ({ params, response }) => {
    const query: string = params.query;
    const allAds: AdModel[] = await AdModel.all();
    let results: AdModel[] = [];
    allAds.forEach(ad => { if (ad.title.toLowerCase().includes(query.toLowerCase())) results.push(ad); });
    return response.send(results);
});