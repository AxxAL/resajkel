import Route from '@ioc:Adonis/Core/Route';

/**
 * Ad routes
 * Logic defined in app/Controllers/Http/AdController.ts
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
Route.get("/ad/my", "AdController.UserAds");

// [GET] /ad:id | Returns detailed view of an ad.
Route.get("/ad/:id", "AdController.Ad");