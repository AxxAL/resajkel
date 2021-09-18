import Route from '@ioc:Adonis/Core/Route';
import AdModel from 'App/Models/AdModel';
import UserModel from 'App/Models/UserModel';

/**
 * Authentication routes.
 */

// [GET] /login | Returns login form.
Route.get("/login", async ({ view }) => {
    return view.render("auth/login-form");
});

// [POST] /login/auth | Authenticates login request.
Route.post("/login/auth", async ({ auth, request, response}) => {
    const email: string = request.input("email");
    const password: string = request.input("password");
    const rememberMe: boolean = request.input("rememberme");
  
    try {
      await auth.use("web").attempt(email, password, rememberMe);
      return response.redirect("/dashboard");
    } catch {
      return response.badRequest("Felaktiga inloggningsuppgifter!");
    }
});
  
// [GET] /logout | Logs user out.
Route.get("/logout", async ({ auth, response}) => {
    await auth.use("web").logout();
    response.redirect("/");
});

// [GET] /register | Returns register form.
Route.get("/register", async ({ view }) => {
    return view.render("auth/register-form");
});
  
// [POST] /register/auth | Authenticates register request.
Route.post("/register/auth", async ({ request, response }) => {
    const firstname: string = request.input("firstname");
    const email: string = request.input("email");
    const password: string = request.input("password");
  
    if (await UserModel.findBy("email", email) != null) return response.badRequest("Den angivna emailen är redan kopplad till ett konto!");
  
    await UserModel.create({ firstname, email, password });
  
    return response.redirect("/dashboard");
});

// [GET] /removeaccount | Remove account and all related ads. GDPR
Route.get("/removeaccount", async ({ auth, response }) => {
    await auth.use("web").authenticate();
    if (auth.user == null) return response.redirect("/login");

    const id: number = auth.user.id;

    await auth.use("web").logout();

    await AdModel.query().where("author_id", id).then(ads => {
        ads.forEach(ad => ad.delete());
    });

    await UserModel.findByOrFail("id", id).then(user => {
        user.delete();
    });

    return response.redirect("/login");
});