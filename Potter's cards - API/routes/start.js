import express from "express";
import UsersControllers from "../controllers/UsersControllers.js";
import AuthentificationController from "../controllers/AuthentificationController.js";
import AuthentificationMiddleware from "../middlewares/AuthentificationMiddleware.js";

const router = express.Router();

router.get("/users", UsersControllers.index); 
router.get("/users/:id", UsersControllers.show);
router.post("/users", UsersControllers.store);
router.put("/users/:id", UsersControllers.update);
router.delete("/users/:id", UsersControllers.destroy);

router.get(
  "/getMyProfile",
  AuthentificationMiddleware.authentification,
  UsersControllers.getMyProfile
);
router.post("/login", AuthentificationController.login);
router.post("/register", AuthentificationController.register);

router.get(
  "/user/:userId/owned-cards",
  AuthentificationMiddleware.authentification,
  UsersControllers.getOwnedCards
);

router.post("/user/:userId/obtained-cards", UsersControllers.addObtainedCards);

router.post(
  "/user/:userId/delete-owned-cards",
  UsersControllers.deleteOwnedCards
);

router.post("/user/:id/actual-timer", UsersControllers.updateTimer)

router.get('/user/:id/get-timer', UsersControllers.getTimer);


export default router;
