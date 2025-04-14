import Report from "../models/Report.js";

export const createReport = async (reportedBy, contentId, type, reason) => {
  try {
    const report = new Report({
      reportedBy,
      [type]: contentId,
      reason,
      status: "Pending",
    });
    await report.save();
    console.log("Report created successfully");
  } catch (error) {
    console.error("Report creation failed:", error);
  }
};

export const resolveReport = async (reportId) => {
  try {
    await Report.findByIdAndUpdate(reportId, { status: "Resolved" });
    console.log("Report resolved successfully");
  } catch (error) {
    console.error("Report resolution failed:", error);
  }
};
