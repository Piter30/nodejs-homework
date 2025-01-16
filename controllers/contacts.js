const Contact = require("../models/contacts");

const contactsController = {
  async getAllContacts(req, res, next) {
    try {
      const { page = 1, limit = 20, favorite } = req.query;
      const skip = (page - 1) * limit;
      const query = { owner: req.user._id };

      if (favorite !== undefined) {
        query.favorite = favorite === "true";
      }

      const contacts = await Contact.find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort({ updatedAt: -1 });

      const total = await Contact.countDocuments(query);

      res.json({
        status: "success",
        code: 200,
        data: {
          contacts,
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getContactById(req, res, next) {
    try {
      const contact = await Contact.findOne({
        _id: req.params.contactId,
        owner: req.user._id,
      });
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
      const { email, phone } = req.body;

      const existingEmail = await Contact.findOne({
        email,
        owner: req.user._id,
      });

      if (existingEmail) {
        return res.status(409).json({
          message: "Contact with this email already exists",
        });
      }

      const existingPhone = await Contact.findOne({
        phone,
        owner: req.user._id,
      });

      if (existingPhone) {
        return res.status(409).json({
          message: "Contact with this phone number already exists",
        });
      }

      const contact = await Contact.create({
        ...req.body,
        owner: req.user._id,
      });

      res.status(201).json({
        status: "success",
        code: 201,
        data: {
          contact,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async removeContact(req, res, next) {
    try {
      const contact = await Contact.findOneAndDelete({
        _id: req.params.contactId,
        owner: req.user._id,
      });
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
      const contact = await Contact.findOneAndUpdate(
        {
          _id: req.params.contactId,
          owner: req.user._id,
        },
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

      const contact = await Contact.findOneAndUpdate(
        {
          _id: req.params.contactId,
          owner: req.user._id,
        },
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

  async getFavoriteContacts(req, res, next) {
    try {
      const contacts = await Contact.find({
        owner: req.user._id,
        favorite: true,
      });

      res.json({
        status: "success",
        code: 200,
        data: { contacts },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = contactsController;
