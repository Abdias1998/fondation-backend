const router = require("express").Router();
const contact_controller = require("../contoler/contact");
router.post("/contact", contact_controller.receiveMessage);

module.exports = router;
