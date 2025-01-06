const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../models/contacts");

const contactsController = {
  async listContacts(req, res) {
    try {
      const contacts = await listContacts();
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getContactById(req, res) {
    try {
      const contact = await getContactById(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(contact);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async addContact(req, res) {
    try {
      const newContact = await addContact(req.body);
      res.status(201).json(newContact);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async removeContact(req, res) {
    try {
      const result = await removeContact(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json({ message: "contact deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateContact(req, res) {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "missing fields" });
      }

      const updatedContact = await updateContact(req.params.id, req.body);
      if (!updatedContact) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(updatedContact);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = contactsController;
