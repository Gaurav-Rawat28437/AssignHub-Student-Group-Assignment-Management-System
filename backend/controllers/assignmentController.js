
const prisma = require("../config/prisma");

const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      fileUrl,
      dueDate,
      assignToAll,
      groupIds
    } = req.body;

    if (!title || !description || !fileUrl || !dueDate) {
      return res.status(400).json({
        message: "All assignment fields are required"
      });
    }

    const dueDateValue = new Date(dueDate);

    if (Number.isNaN(dueDateValue.getTime())) {
      return res.status(400).json({
        message: "Invalid due date"
      });
    }

    if (dueDateValue <= new Date()) {
      return res.status(400).json({
        message: "Due date must be in the future"
      });
    }

    let selectedGroupIds = [];

    if (assignToAll !== true) {
      if (!Array.isArray(groupIds) || groupIds.length === 0) {
        return res.status(400).json({
          message: "Select at least one group"
        });
      }

      selectedGroupIds = [...new Set(groupIds.map(Number))];

      if (
        selectedGroupIds.some(
          id => !Number.isInteger(id) || id <= 0
        )
      ) {
        return res.status(400).json({
          message: "Invalid group IDs"
        });
      }

      const groups = await prisma.group.findMany({
        where: {
          id: { in: selectedGroupIds }
        },
        select: { id: true }
      });

      if (groups.length !== selectedGroupIds.length) {
        return res.status(400).json({
          message: "One or more groups do not exist"
        });
      }
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        fileUrl,
        dueDate: dueDateValue,
        assignToAll: assignToAll === true,
        createdById: req.user.id,
        groups: {
          create: selectedGroupIds.map(groupId => ({
            groupId
          }))
        }
      },
      include: {
        groups: {
          include: {
            group: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: "Assignment created successfully",
      assignment
    });
  } catch (error) {
    res.status(500).json({
      message: "Assignment creation failed",
      error: error.message
    });
  }
};

module.exports = { createAssignment };
