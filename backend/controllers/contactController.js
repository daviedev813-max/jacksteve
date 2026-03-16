import Contact from "../models/Contact.js";

/*
  POST /api/contact
  @desc Capture Inquiry Manifest from the Contact Terminal
*/
export const createContact = async (req, res, next) => {
  try {
    // Capturing 'role' and 'subject' to help dispatch prioritize
    const { name, email, role, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      role: role || 'GUEST', // Categorize: FARMER, MILLER, PARTNER
      message,
      status: 'UNREAD' // Initial state for Admin Command
    });

    res.status(201).json({
      success: true,
      message: "Transmission Received: Jacksteve Dispatch will review your inquiry.",
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

/*
  GET /api/contact
  @desc Admin View: Reviewing the Inquiry Queue
*/
export const getContacts = async (req, res, next) => {
  try {
    // Only an ADMIN should ever hit this route
    const contacts = await Contact
      .find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

/*
  PATCH /api/contact/:id
  @desc Mark inquiry as 'RESOLVED' or 'ARCHIVED'
*/
export const updateContactStatus = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    res.json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};
