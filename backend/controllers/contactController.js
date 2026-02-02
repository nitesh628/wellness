import Contact from "../models/contactModel.js";

export const createContact = async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
