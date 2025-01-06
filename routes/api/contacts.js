const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts");
const { validateContact } = require("../../middlewares/validation");

// GET /api/contacts
router.get("/", contactsController.listContacts);

// GET /api/contacts/:id
router.get("/:id", contactsController.getContactById);

// POST /api/contacts
router.post("/", validateContact, contactsController.addContact);

// DELETE /api/contacts/:id
router.delete("/:id", contactsController.removeContact);

// PUT /api/contacts/:id
router.put("/:id", validateContact, contactsController.updateContact);

module.exports = router;
