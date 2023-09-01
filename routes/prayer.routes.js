const router = require("express").Router();
const prayer_controller = require("../contoler/prayer");
router.post("/prayer", prayer_controller.receiveMessagePrayer);

module.exports = router;
