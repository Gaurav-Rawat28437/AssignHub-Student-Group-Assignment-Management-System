
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


const getAllAssignments = async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
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
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json({
      message: "Assignments fetched successfully",
      count: assignments.length,
      assignments
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assignments",
      error: error.message
    });
  }
};


const updateAssignment = async (req, res) => {
  try {
    const assignmentId = Number(req.params.id);

    const {
      title,
      description,
      fileUrl,
      dueDate,
      assignToAll,
      groupIds
    } = req.body;

    if (
      !Number.isInteger(assignmentId) ||
      assignmentId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid assignment ID"
      });
    }

    if (!title || !description || !fileUrl || !dueDate) {
      return res.status(400).json({
        message: "All assignment fields are required"
      });
    }

    if (typeof assignToAll !== "boolean") {
      return res.status(400).json({
        message: "assignToAll must be true or false"
      });
    }

    const dueDateValue = new Date(dueDate);

    if (
      Number.isNaN(dueDateValue.getTime()) ||
      dueDateValue <= new Date()
    ) {
      return res.status(400).json({
        message: "Please provide a valid future due date"
      });
    }

    let selectedGroupIds = [];

    if (!assignToAll) {
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

    const existingAssignment = await prisma.assignment.findUnique({
      where: { id: assignmentId }
    });

    if (!existingAssignment) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    const assignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        title,
        description,
        fileUrl,
        dueDate: dueDateValue,
        assignToAll,
        groups: {
          deleteMany: {},
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

    res.status(200).json({
      message: "Assignment updated successfully",
      assignment
    });
  } catch (error) {
    res.status(500).json({
      message: "Assignment update failed",
      error: error.message
    });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  updateAssignment
};