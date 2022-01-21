import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import Ad from "App/Models/Ad";
import User from "App/Models/User";
import { schema, rules } from "@ioc:Adonis/Core/Validator";

/**
 *  Logic for all authentication routes.
 * Routes defined in /start/routers/AuthRouter.ts
 */

export default class AuthController {

    public  async LoginForm({ view }: HttpContextContract): Promise<string> {
        return view.render("auth/login-form");
    } // Returns view for logging in.

    public async AuthPOST({ request, response, auth }: HttpContextContract): Promise<void> {

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

    public async RegisterForm({ view }: HttpContextContract): Promise<string> {
        return view.render("auth/register-form");
    } // Returns view for registering a user.

    public async RegisterPOST({ request, response }: HttpContextContract): Promise<void> {

        const userSchema = schema.create({
            email: schema.string({}, [ rules.regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ]), // Email regex
            phonenumber: schema.string({}, [ rules.regex(/^07(0|2|3|6|9)\d{7}$/g) ]), // Swedish phonenumber regex
            password: schema.string(),
            firstname: schema.string()
        });
        const payload = await request.validate({ schema: userSchema });

        if (await User.findBy("email", payload.email) != null) {
            return response.badRequest("Den angivna emailen är redan kopplad till ett konto!");
        }
    
        await User.create(payload);
    
        return response.redirect("/dashboard");
    } // Registers new user.

    public async Logout({ response, auth }: HttpContextContract): Promise<void> {
        await auth.use("web").logout();
        return response.redirect("/");
    } // Signs out user who is currently logged.

    public async RemoveUser({ auth, response }: HttpContextContract): Promise<void> {
        await auth.use("web").authenticate();
        if (auth.user == null) return response.redirect("/login");

        const id: string = auth.user.id;

        await auth.use("web").logout();

        await Ad.query().where("author_id", id).then(ads => ads.forEach(ad => ad.delete()));

        await User.findByOrFail("id", id).then(async user => await user.obliterateMe());

        return response.redirect("/login");
    } // Removes currently logged in user's account and all their ads.
}