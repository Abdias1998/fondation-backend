const router = require("express").Router();
const contact_controller = require("../contoler/contact");
const prayer_controller = require("../contoler/prayer");
const testimonial_controler = require("../contoler/testimonial");
router.post("/prayer", prayer_controller.receiveMessagePrayer);
router.post("/testimonial", testimonial_controler.receiveMessageTestimonial);
router.post("/contact", contact_controller.receiveMessage);
router.post("/contact-guide", contact_controller.receiveMessageAdoris);

module.exports = router;
