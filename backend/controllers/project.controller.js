import projectModel from "../models/project.model.js";
import * as projectService from "../services/project.service.js";
import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";

export const createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name } = req.body;

        const userId = req.user._id; // use ID directly

        const newProject = await projectService.createProject({
            name,
            userId
        });

        res.status(201).json({
            message: "Project created successfully",
            project: {
                _id: newProject._id,
                name: newProject.name
            }
        });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getAllProject = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await projectService.getAllProject(userId); // This already populates users

    res.status(200).json({
      message: "Projects fetched successfully",
      projects: projects.map(project => ({
        _id: project._id,
        name: project.name,
        users: project.users.map(user => ({
          _id: user._id,
          email: user.email,
        }))
      }))
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: error.message });
  }
};


export const addUserToProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Validation failed", details: errors.array() });
  }

  try {
    const { projectId, users } = req.body;
    const userId = req.user._id; // Authenticated user

    // Validate projectId format
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await projectService.addUsersToProject({
      projectId,
      users,
      userId,
    });

    res.status(200).json({
      message: "Users added to project successfully",
      project: {
        _id: project._id,
        name: project.name,
        users: project.users.map((user) => ({
          _id: user._id,
          email: user.email,
        })),
      },
    });
  } catch (error) {
    console.error("Error adding user to project:", error);
    res.status(500).json({ error: error.message });
  }
};
export const getProjectById = async (req, res) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: "Invalid project ID" });
  }

  try {
    const project = await projectService.getProjectById({ projectId });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json({
      message: "Project fetched successfully",
      project: {
        _id: project._id,
        name: project.name,
        users: project.users.map(user => ({
          _id: user._id,
          email: user.email
        }))
      }
    });
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    res.status(500).json({ error: error.message });
  }
};
