import Route from '@ioc:Adonis/Core/Route';
import AdModel from 'App/Models/AdModel';
import UserModel from 'App/Models/UserModel';

/**
 * Ad routes
*/

// [GET] /ad/all | Returns a list of all ads.
Route.get("/ad/all", async ({ view }) => {
  const ads: AdModel[] = await AdModel.all();
  return view.render("ad/ad-list", { ads });
});
  
// [GET] /ad/create | Returns form for creating new ad.
Route.get("/ad/create", async ({ view, auth }) => {
  await auth.use("web").authenticate();
  return view.render("ad/create-form");
})
  
  // [POST] /ad/create | Registers new ad.
Route.post("/ad/create", async ({ request, response, auth }) => {
  await auth.use("web").authenticate();
  if (!auth.user) return response.redirect("/");
  
  const title: string = request.input("title");
  const author_id: number = auth.user?.id;
  const price: number = request.input("price");
  const description: string = request.input("description");
  const image_url: string = request.input("imageurl");
  
  const ad = await AdModel.create({ title, author_id, price, description, image_url });
  
  response.redirect(`/ad/${ad.id}`);
});
  
// [GET] /ad/remove/:id | Removes ad.
Route.get("/ad/remove/:id", async ({ params, response, auth}) => {
  await auth.use("web").authenticate();
  if (!auth.user) return response.redirect("/");
  
  const id: number = params.id;
  
  await AdModel.findByOrFail("id", id).then(ad => {
    if (ad.author_id == auth.user?.id) {
      ad.delete();
    }
  });
  
  return response.redirect("/ad/my");
});
  
// [GET] /ad/my | Returns list of user's ads.
Route.get("/ad/my", async ({ view, auth, response }) => {
  await auth.use("web").authenticate();
  if (auth.user == null) return response.redirect("/");
  
  const myAds: AdModel[] = await AdModel.query().where("author_id", auth.user?.id);
  
  return view.render("ad/my-ads", { ads: myAds });
});
  
// [GET] /ad:id | Returns detailed view of an ad.
Route.get("/ad/:id", async ({ view, params, response }) => {
  const id: number = params.id;
  const ad: AdModel | null = await AdModel.findBy("id", id);
  if (ad == null) return response.redirect("/ad/all");
  const author: UserModel | null = await UserModel.findBy("id", ad.author_id);
  if (ad == null) return response.redirect("/ad/all");
  
  return view.render("ad/ad", { ad, author });
});