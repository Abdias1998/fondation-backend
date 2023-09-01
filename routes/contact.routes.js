const router = require("express").Router();
const contact_controller = require("../contoler/contact");
router.post("/prayer", contact_controller.receiveMessage);

module.exports = router;
