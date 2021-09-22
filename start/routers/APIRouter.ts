import Route from '@ioc:Adonis/Core/Route';
import AdModel from 'App/Models/AdModel';

Route.get("/api/ad/all", async ({ response }) => {
    return response.send(await AdModel.all());
});