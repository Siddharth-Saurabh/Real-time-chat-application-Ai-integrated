import userModel from '../models/user.model.js';
import projectModel from '../models/project.model.js';
import mongoose from 'mongoose';


export const createProject = async ({
    name, userId
}) => {
    if(!name) {
        throw new Error('Project name is required');
    }
    if(!userId) {
        throw new Error('User ID is required');
    }
    const project = await projectModel.create({
        name,
        users: [userId]
    });
    return project;
}
export const getAllProject = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const projects = await projectModel
    .find({ users: userId })
    .populate('users', '_id email'); // ✅ Populate only needed fields

  return projects;
};


export const addUsersToProject = async ({ projectId, users, userId }) => {
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!Array.isArray(users) || users.length === 0) {
    throw new Error("Users must be a non-empty array");
  }

  // Validate each user ID
  for (const userToAdd of users) {
    if (!mongoose.Types.ObjectId.isValid(userToAdd)) {
      throw new Error(`Invalid User ID: ${userToAdd}`);
    }
  }

  const project = await projectModel.findById(projectId).populate("users", "_id email");
  if (!project) {
    throw new Error("Project not found");
  }

  // Check if requesting user is part of the project
  const isAuthorized = project.users.some((u) => u._id.toString() === userId.toString());
  if (!isAuthorized) {
    throw new Error("You are not authorized to modify this project");
  }

  // Avoid duplicate users
  const currentUserIds = new Set(project.users.map((u) => u._id.toString()));
  const updatedUsers = [...currentUserIds, ...users.map((id) => id.toString())];
  project.users = [...new Set(updatedUsers)];

  await project.save();
  await project.populate("users", "_id email");

  return project;
};

export const getProjectById = async ({projectId}) => {
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }

  const project = await projectModel.findById(projectId).populate("users", "_id email");
  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};
