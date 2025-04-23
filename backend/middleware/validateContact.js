import { CONTACT_VALIDATION, ERROR_MESSAGES } from "../config/constants.js";

const validateContact = (req, res, next) => {
  const { name, email, subject, message } = req.body;
  const errors = [];

  // Name validation
  if (!name) {
    errors.push(ERROR_MESSAGES.FIELD_REQUIRED("Name"));
  } else if (
    name.length < CONTACT_VALIDATION.NAME_MIN ||
    name.length > CONTACT_VALIDATION.NAME_MAX
  ) {
    errors.push(
      ERROR_MESSAGES.FIELD_LENGTH(
        "Name",
        CONTACT_VALIDATION.NAME_MIN,
        CONTACT_VALIDATION.NAME_MAX
      )
    );
  }

  // Email validation
  if (!email) {
    errors.push(ERROR_MESSAGES.FIELD_REQUIRED("Email"));
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push(ERROR_MESSAGES.INVALID_EMAIL);
  }

  // Subject validation
  if (!subject) {
    errors.push(ERROR_MESSAGES.FIELD_REQUIRED("Subject"));
  } else if (
    subject.length < CONTACT_VALIDATION.SUBJECT_MIN ||
    subject.length > CONTACT_VALIDATION.SUBJECT_MAX
  ) {
    errors.push(
      ERROR_MESSAGES.FIELD_LENGTH(
        "Subject",
        CONTACT_VALIDATION.SUBJECT_MIN,
        CONTACT_VALIDATION.SUBJECT_MAX
      )
    );
  }

  // Message validation
  if (!message) {
    errors.push(ERROR_MESSAGES.FIELD_REQUIRED("Message"));
  } else if (
    message.length < CONTACT_VALIDATION.MESSAGE_MIN ||
    message.length > CONTACT_VALIDATION.MESSAGE_MAX
  ) {
    errors.push(
      ERROR_MESSAGES.FIELD_LENGTH(
        "Message",
        CONTACT_VALIDATION.MESSAGE_MIN,
        CONTACT_VALIDATION.MESSAGE_MAX
      )
    );
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export default validateContact;
