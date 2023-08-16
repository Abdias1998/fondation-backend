const router = require("express").Router();
const subscribe_controller = require("../contoler/subscribe");
router.post("/subscribe-donateur", subscribe_controller.subscribe);
router.get("/subscribe-donateur", subscribe_controller.getAllUsers);
router.delete(
  "/subscribe-donateur/delete/:id",
  subscribe_controller.deleteUser
);
module.exports = router;
