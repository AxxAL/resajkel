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

import Route from '@ioc:Adonis/Core/Route';
import "./routers/AdRouter"; // View, Register & Remove ads.
import "./routers/AuthRouter" // Login & Register user.

// [GET] / | Returns home page.
Route.get('/', async ({ view }) => {
  return view.render("home");
});

// [GET] /dashboard | Returns user dashboard.
Route.get("/dashboard", async ({ view, auth }) => {
  await auth.use("web").authenticate();
  return view.render("dashboard");
});