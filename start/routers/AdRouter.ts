import Route from '@ioc:Adonis/Core/Route';
import { CreateNewAd } from 'App/Handlers/DatabaseHandler';
import AdModel from 'App/Models/AdModel';
import UserModel from 'App/Models/UserModel';

/**
 * Ad routes
*/

// [GET] /ad/all | Returns a list of all ads.
Route.get("/ad/all", "AdController.All");
  
// [GET] /ad/create | Returns form for creating new ad.
Route.get("/ad/create", "AdController.CreateForm");
  
  // [POST] /ad/create | Registers new ad.
Route.post("/ad/create", "AdController.CreatePost");
  
// [GET] /ad/remove/:id | Removes ad.
Route.get("/ad/remove/:id", "AdController.RemoveAd");
  
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