
const prisma = require("../config/prisma");

const createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Group name is required"
      });
    }

    const group = await prisma.group.create({
      data: {
        name,
        createdById: req.user.id,
        members: {
          create: {
            userId: req.user.id
          }
        }
      },
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
        }
      }
    });

    res.status(201).json({
      message: "Group created successfully",
      group
    });
  } catch (error) {
    res.status(500).json({
      message: "Group creation failed",
      error: error.message
    });
  }
};


const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const groupId = Number(req.params.groupId);

    if (!email) {
      return res.status(400).json({
        message: "Member email is required"
      });
    }

    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        createdById: req.user.id
      }
    });

    if (!group) {
      return res.status(404).json({
        message: "Group not found or you are not the group creator"
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.role !== "STUDENT") {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const existingMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: user.id,
          groupId
        }
      }
    });

    if (existingMember) {
      return res.status(409).json({
        message: "Student is already a group member"
      });
    }

    const member = await prisma.groupMember.create({
      data: {
        userId: user.id,
        groupId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: "Member added successfully",
      member
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add member",
      error: error.message
    });
  }
};


const getMyGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: req.user.id
          }
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
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
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json({
      message: "Groups fetched successfully",
      count: groups.length,
      groups
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch groups",
      error: error.message
    });
  }
};


const getGroupById = async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);

    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        members: {
          some: {
            userId: req.user.id
          }
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
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
        }
      }
    });

    if (!group) {
      return res.status(404).json({
        message: "Group not found or you are not a member"
      });
    }

    res.status(200).json({
      message: "Group fetched successfully",
      group
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch group",
      error: error.message
    });
  }
};

module.exports = {
  createGroup,
  addMember,
  getMyGroups,
  getGroupById
};