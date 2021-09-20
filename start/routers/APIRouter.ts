import Route from '@ioc:Adonis/Core/Route';
import { GetAllAds } from "../../app/Handlers/DatabaseHandler";

Route.get("/api/ad/all", async ({ response }) => {
    return response.send(await GetAllAds());
});