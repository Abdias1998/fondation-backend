const router = require("express").Router();
const contact_controller = require("../contoler/contact");
const prayer_controller = require("../contoler/prayer");
router.post("/prayer", prayer_controller.receiveMessagePrayer);
router.post("/contact", contact_controller.receiveMessage);

module.exports = router;
