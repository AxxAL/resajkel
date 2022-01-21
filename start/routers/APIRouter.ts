import Route from '@ioc:Adonis/Core/Route';
import Ad from 'App/Models/Ad';
import User from 'App/Models/User';

Route.get("/api/ad/all", async ({ response }) => {
    return response.send(await Ad.all());
});

Route.get("/api/ad/:id", async ({ params, response }) => {
    const id: number = params.id;
    const ad: Ad | null = await Ad.findBy("id", id);
    if (ad == null) return response.redirect("/ad/all");
    const author: User | null = await User.findBy("id", ad.author_id);
    return response.json({ ad, author });
});

Route.get("/api/ad/search/:query", async ({ params, response }) => {
    const query: string = params.query;
    const allAds: Ad[] = await Ad.all();
    let results: Ad[] = [];
    allAds.forEach(ad => { if (ad.title.toLowerCase().includes(query.toLowerCase())) results.push(ad); });
    return response.send(results);
});