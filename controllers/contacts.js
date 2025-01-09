const Contact = require("../models/contacts");

const contactsController = {
  async getAllContacts(req, res, next) {
    try {
      const contacts = await Contact.find();
      res.json(contacts);
    } catch (error) {
      next(error);
    }
  },

  async getContactById(req, res, next) {
    try {
      const contact = await Contact.findById(req.params.contactId);
      if (!contact) {
        return res.status(404).json({ message: "Not found" });
      }
      res.json(contact);
    } catch (error) {
      next(error);
    }
  },

  async addContact(req, res, next) {
    try {
      const contact = await Contact.create(req.body);
      res.status(201).json(contact);
    } catch (error) {
      next(error);
    }
  },

  async removeContact(req, res, next) {
    try {
      const contact = await Contact.findByIdAndDelete(req.params.contactId);
      if (!contact) {
        return res.status(404).json({ message: "Not found" });
      }
      res.json({ message: "contact deleted" });
    } catch (error) {
      next(error);
    }
  },

  async updateContact(req, res, next) {
    try {
      const contact = await Contact.findByIdAndUpdate(
        req.params.contactId,
        req.body,
        { new: true }
      );
      if (!contact) {
        return res.status(404).json({ message: "Not found" });
      }
      res.json(contact);
    } catch (error) {
      next(error);
    }
  },

  async updateFavorite(req, res, next) {
    try {
      const { favorite } = req.body;
      if (favorite === undefined) {
        return res.status(400).json({ message: "missing field favorite" });
      }

      const contact = await Contact.findByIdAndUpdate(
        req.params.contactId,
        { favorite },
        { new: true }
      );

      if (!contact) {
        return res.status(404).json({ message: "Not found" });
      }

      res.json(contact);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = contactsController;
