import User from "../models/User.js";
// import Report from "../models/Report.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user role" });
  }
};

// export const getAllReports = async (req, res) => {
//   try {
//     const reports = await Report.find();
//     res.status(200).json(reports);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch reports" });
//   }
// };

// export const deleteReport = async (req, res) => {
//   try {
//     const { reportId } = req.params;
//     await Report.findByIdAndDelete(reportId);
//     res.status(200).json({ message: "Report resolved successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete report" });
//   }
// };
