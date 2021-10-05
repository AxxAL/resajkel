import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import AdModel from "App/Models/AdModel";
import UserModel from "App/Models/UserModel";
import { schema, rules } from "@ioc:Adonis/Core/Validator";

/**
 *  Logic for all authentication routes.
 * Routes defined in /start/routers/AuthRouter.ts
 */

export default class AuthController {

    public  async LoginForm(ctx: HttpContextContract): Promise<string> {
        const { view } = ctx;
        return view.render("auth/login-form");
    } // Returns view for logging in.

    public async AuthPOST(ctx: HttpContextContract): Promise<void> {
        const { request, response, auth } = ctx;

        const email: string = request.input("email");
        const password: string = request.input("password");
        const rememberMe: boolean = request.input("rememberme");
    
        try {
            await auth.use("web").attempt(email, password, rememberMe);
            return response.redirect("/dashboard");
        } catch {
            return response.badRequest("Felaktiga inloggningsuppgifter!");
        }
    } // Authenticates user and logs them in.

    public async RegisterForm(ctx: HttpContextContract): Promise<string> {
        const { view } = ctx;
        return view.render("auth/register-form");
    } // Returns view for registering a user.

    public async RegisterPOST(ctx: HttpContextContract): Promise<void> {
        const { request, response } = ctx;

        const userSchema = schema.create({
            email: schema.string({}, [ rules.email() ]),
            phonenumber: schema.string(),
            password: schema.string(),
            firstname: schema.string()
        });
        const payload = await request.validate({ schema: userSchema });

        if (await UserModel.findBy("email", payload.email) != null) return response.badRequest("Den angivna emailen är redan kopplad till ett konto!");
    
        await UserModel.create(payload);
    
        return response.redirect("/dashboard");
    } // Registers new user.

    public async Logout(ctx: HttpContextContract): Promise<void> {
        const { response, auth } = ctx;

        await auth.use("web").logout();
        return response.redirect("/");
    } // Signs out user who is currently logged.

    public async RemoveUser(ctx: HttpContextContract): Promise<void> {
        const { auth, response } = ctx;

        await auth.use("web").authenticate();
        if (auth.user == null) return response.redirect("/login");

        const id: number = auth.user.id;

        await auth.use("web").logout();

        await AdModel.query().where("author_id", id).then(ads => ads.forEach(ad => ad.delete()));

        await UserModel.findByOrFail("id", id).then(user => user.delete());

        return response.redirect("/login");
    } // Removes currently logged in user's account and all their ads.
}