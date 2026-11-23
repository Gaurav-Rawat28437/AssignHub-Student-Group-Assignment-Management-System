
const prisma = require("../config/prisma");

const getDashboardAnalytics = async (req, res) => {
  try {
    const totalStudents = await prisma.user.count({
      where: { role: "STUDENT" }
    });

    const totalGroups = await prisma.group.count();

    const totalAssignments = await prisma.assignment.count();

    const totalSubmissions = await prisma.submission.count({
      where: { confirmed: true }
    });

    const totalExpectedSubmissions = await prisma.groupMember.count({
      where: {
        group: {
          assignments: {
            some: {
              assignment: {
                assignToAll: false
              }
            }
          }
        }
      }
    });

    const assignedToAllCount = await prisma.assignment.count({
      where: { assignToAll: true }
    });

    const allGroups = await prisma.group.count();

    const expectedSubmissions =
      totalExpectedSubmissions +
      (assignedToAllCount * allGroups);

    const progressPercentage = expectedSubmissions
      ? Math.round(
          (totalSubmissions / expectedSubmissions) * 100
        )
      : 0;

    res.status(200).json({
      totalStudents,
      totalGroups,
      totalAssignments,
      totalConfirmedSubmissions: totalSubmissions,
      expectedSubmissions,
      progressPercentage
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get dashboard analytics",
      error: error.message
    });
  }
};

module.exports = { getDashboardAnalytics };
