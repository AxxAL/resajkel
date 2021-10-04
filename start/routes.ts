import Route from '@ioc:Adonis/Core/Route';
import "./routers/AdRouter"; // View, Register & Remove ads.
import "./routers/AuthRouter"; // Login & Register user.
import "./routers/APIRouter"; // API routes.


Route.get('/', async ({ view }) => {
  return view.render("home");
}); // [GET] / | Returns view for home page.


Route.get("/dashboard", async ({ view, auth }) => {
  await auth.use("web").authenticate();
  return view.render("dashboard");
}); // [GET] /dashboard | Returns view for the user dashboard.