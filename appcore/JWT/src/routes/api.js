const router = require("express").Router();
const AuthMiddleWare = require("../middleware/AuthMiddleware");
const AuthController = require("../controller/AuthController");
const FriendController = require("../controller/FriendController");

let initAPIs = (app) => {
  router.post("/login", AuthController.login);
  router.post("/refresh-token", AuthController.refreshToken);

  //Sử dụng authMiddleware.isAuth trước những api cần xác thực
  router.use(AuthMiddleWare.isAuth);
  //list Protect APIs:
  router.get("/friends", FriendController.friendLists);

  return app.use("/", router);
};

module.exports = initAPIs;
