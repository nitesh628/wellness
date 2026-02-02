import Contact from "../models/contactModel.js";

export const createContact = async (req, res) => {
    try {
        const { name, email, message, phone } = req.body;

        // Validate required fields
        if (!name || !email || !message || !phone) {
            return res.status(400).json({
                success: false,
                error: "All fields are required"
            });
        }

        // Check if contact with same email or phone already exists
        const existingContact = await Contact.findOne({
            $or: [
                { email: email },
                { phone: phone }
            ]
        });

        if (existingContact) {
            const duplicateField = existingContact.email === email ? 'email' : 'phone';
            return res.status(409).json({
                success: false,
                error: `A contact with this ${duplicateField} already exists`,
                field: duplicateField
            });
        }

        // Create new contact
        const contact = await Contact.create(req.body);
        res.status(201).json({
            success: true,
            message: "Contact form submitted successfully",
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to submit contact form",
            message: error.message
        });
    }
};
