import Route from '@ioc:Adonis/Core/Route';

/**
 * Authentication routes
 * Logic defined in app/Controllers/Http/AuthController.ts
*/

// [GET] /login | Returns login form.
Route.get("/login", "AuthController.LoginForm");

// [POST] /login/auth | Authenticates login request.
Route.post("/login/auth", "AuthController.AuthPOST");
  
// [GET] /logout | Logs user out.
Route.get("/logout", "AuthController.Logout");

// [GET] /register | Returns register form.
Route.get("/register", "AuthController.RegisterForm");
  
// [POST] /register/auth | Authenticates user registration request.
Route.post("/register/auth", "AuthController.RegisterPOST");

// [GET] /removeaccount | Remove account and all related ads. GDPR
Route.get("/removeaccount", "AuthController.RemoveUser");