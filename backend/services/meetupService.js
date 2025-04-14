import nodemailer from "nodemailer";

export const scheduleMeetup = async (
  organizerEmail,
  participantEmail,
  dateTime,
  link
) => {
  try {
    const subject = "Meetup Invitation";
    const text = `You have a scheduled meetup on ${dateTime}. Join using this link: ${link}`;

    await sendEmail(participantEmail, subject, text);
    await sendEmail(organizerEmail, subject, text);

    console.log("Meetup invitations sent successfully");
  } catch (error) {
    console.error("Meetup scheduling failed:", error);
  }
};
