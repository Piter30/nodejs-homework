const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts");
const { validateContact } = require("../../middlewares/validation");

// GET all contacts
router.get("/", contactsController.getAllContacts);

// GET contact by ID
router.get("/:contactId", contactsController.getContactById);

router.post("/", validateContact, contactsController.addContact);

// DELETE contact
router.delete("/:contactId", contactsController.removeContact);

// PUT update contact
router.put("/:contactId", validateContact, contactsController.updateContact);

// PATCH update favorite status
router.patch("/:contactId/favorite", contactsController.updateFavorite);

module.exports = router;
