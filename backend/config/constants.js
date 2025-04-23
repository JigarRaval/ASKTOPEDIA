export const CONTACT_VALIDATION = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  SUBJECT_MIN: 5,
  SUBJECT_MAX: 100,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 1000,
};

export const ERROR_MESSAGES = {
  INVALID_EMAIL: "Please provide a valid email address",
  FIELD_REQUIRED: (field) => `${field} is required`,
  FIELD_LENGTH: (field, min, max) =>
    `${field} must be between ${min} and ${max} characters`,
};
