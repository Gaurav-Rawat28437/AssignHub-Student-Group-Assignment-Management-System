
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



const getMyAssignments = async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      where: {
        OR: [
          {
            assignToAll: true
          },
          {
            groups: {
              some: {
                group: {
                  members: {
                    some: {
                      userId: req.user.id
                    }
                  }
                }
              }
            }
          }
        ]
      },
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
        },
        submissions: {
          where: {
            studentId: req.user.id
          }
        }
      },
      orderBy: {
        dueDate: "asc"
      }
    });

    const formattedAssignments = assignments.map((assignment) => ({
      ...assignment,
      submissions: assignment.submissions
    }));

    res.status(200).json({
      message: "My assignments fetched successfully",
      count: formattedAssignments.length,
      assignments: formattedAssignments
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assignments",
      error: error.message
    });
  }
};



const confirmSubmission = async (req, res) => {
  try {
    const assignmentId = Number(req.params.id);
    const { groupId } = req.body;

    if (
      !Number.isInteger(assignmentId) ||
      assignmentId <= 0 ||
      !Number.isInteger(Number(groupId)) ||
      Number(groupId) <= 0
    ) {
      return res.status(400).json({
        message: "Valid assignment ID and group ID are required"
      });
    }

    const parsedGroupId = Number(groupId);

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId }
    });

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    const membership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: req.user.id,
          groupId: parsedGroupId
        }
      }
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this group"
      });
    }

    if (!assignment.assignToAll) {
      const assignedGroup = await prisma.assignmentGroup.findUnique({
        where: {
          assignmentId_groupId: {
            assignmentId,
            groupId: parsedGroupId
          }
        }
      });

      if (!assignedGroup) {
        return res.status(403).json({
          message: "This assignment is not assigned to your group"
        });
      }
    }

    const submission = await prisma.submission.upsert({
      where: {
        assignmentId_groupId_studentId: {
          assignmentId,
          groupId: parsedGroupId,
          studentId: req.user.id
        }
      },
      update: {
        confirmed: true,
        confirmedAt: new Date()
      },
      create: {
        assignmentId,
        groupId: parsedGroupId,
        studentId: req.user.id,
        confirmed: true,
        confirmedAt: new Date()
      }
    });

    res.status(200).json({
      message: "Submission confirmed successfully",
      submission
    });
  } catch (error) {
    res.status(500).json({
      message: "Submission confirmation failed",
      error: error.message
    });
  }
};


const getAssignmentProgress = async (req, res) => {
  try {
    const assignmentId = Number(req.params.id);

    if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
      return res.status(400).json({
        message: "Invalid assignment ID"
      });
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        groups: {
          select: {
            groupId: true
          }
        }
      }
    });

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    const groupIds = assignment.assignToAll
      ? undefined
      : assignment.groups.map((item) => item.groupId);

    const groups = await prisma.group.findMany({
      where: groupIds ? { id: { in: groupIds } } : {},
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        submissions: {
          where: {
            assignmentId
          }
        }
      }
    });

    const progress = groups.map((group) => {
      const members = group.members.map((member) => {
        const submission = group.submissions.find(
          (item) => item.studentId === member.userId
        );

        return {
          student: member.user,
          confirmed: submission?.confirmed ?? false,
          confirmedAt: submission?.confirmedAt ?? null
        };
      });

      const totalMembers = members.length;
      const confirmedCount = members.filter(
        (member) => member.confirmed
      ).length;

      return {
        groupId: group.id,
        groupName: group.name,
        totalMembers,
        confirmedCount,
        progressPercentage: totalMembers
          ? Math.round((confirmedCount / totalMembers) * 100)
          : 0,
        members
      };
    });

    res.status(200).json({
      assignment: {
        id: assignment.id,
        title: assignment.title
      },
      totalGroups: progress.length,
      totalStudents: progress.reduce(
        (total, group) => total + group.totalMembers,
        0
      ),
      totalConfirmed: progress.reduce(
        (total, group) => total + group.confirmedCount,
        0
      ),
      groups: progress
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assignment progress",
      error: error.message
    });
  }
};


module.exports = {
  createAssignment,
  getAllAssignments,
  updateAssignment,
  getMyAssignments,
  confirmSubmission,
  getAssignmentProgress
};