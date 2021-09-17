/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import { Router } from '@adonisjs/core/build/standalone';
import Route from '@ioc:Adonis/Core/Route';

const ads = [
  {
    id: 0,
    title: "Hammare",
    description: "Man kan slå in spikar i trä med detta verktyg. (Eller slå in huvuden.)",
    imageUrl: "https://i.ebayimg.com/images/g/aCoAAOSwrRZdLkxd/s-l400.jpg"
  },
  {
    id: 1,
    title: "Spik",
    description: "Man kan avända dessa för att sätta ihop plankor.",
    imageUrl: "https://www.slojdfokus.se/images/25160.jpg"
  },
  {
    id: 2,
      title: "Såg",
      description: "Man kan avända denna för att såga plankor och människor itu.",
      imageUrl: "https://www.bauhaus.se/media/catalog/product/cache/06447b731d1cbff22138e7150384a1c9/1/0/1002949A.jpg"
  },
  {
    id: 3,
      title: "Skruvdragare",
      description: "Kan användas för att skruva in skruvar i plankor eller för att borra genom ett kranium.",
      imageUrl: "https://images.clasohlson.com/medias/sys_master/ha0/hb6/9665253048350.jpg"
  },
  {
    id: 4,
      title: "Tång",
      description: "Klarar av att få hårt grepp om saker och att dra tänder.",
      imageUrl: "https://www.esska.se/esska_se/bilder/lbilder/23335c7160292f371bbd0afbef34cf92_z.jpg"
  }
]

// [GET] / | Returns home page
Route.get('/', async ({ view }) => {
  return view.render("home");
});


/**
 * Ad routes
 */

// [GET] /ad/all | Returns a list of all ads
Route.get("/ad/all", async ({ view }) => {
  return view.render("ad-list", { ads });
});

// [GET] /ad:id | Returns detailed view of an ad
Route.get("ad/:id", async ({ view, params }) => {
  const id: number = params.id;
  let ad: Object = {};

  ads.forEach(index => {
    if (index.id == id) {
      ad = index;
    }
  });

  return view.render("ad", { ad });
});

/**
 * Authentication routes
 */

// [GET] /login | Returns login form
Route.get("/login", ({ view }) => {
  return view.render("auth/login-form");
});

// [POST] /login/auth | Authenticates login request
Route.post("/login/auth", ({ auth, request}) => {

});