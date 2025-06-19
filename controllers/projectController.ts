import { Request, Response } from 'express';
import Project, { IProject, ITeamMember } from '../models/Project';
import User, { IUser } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const createProject = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    const project = new Project({
      title,
      description,
      teamMembers: [{ user: req.user._id, role: 'owner' }]
    });
    await project.save();
    const populatedProject = await Project.findById(project._id)
      .populate('teamMembers.user', 'name email');
    res.status(201).json(populatedProject);
  } catch (error: any) {
    console.error('Create project error:', error);
    res.status(400).json({ message: 'Failed to create project', error: error.message });
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const projects = await Project.find({
      'teamMembers.user': req.user._id
    }).populate('teamMembers.user', 'name email');
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProject = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Project ID is required' });
    }
    const project = await Project.findOne({
      _id: req.params.id,
      'teamMembers.user': req.user._id
    }).populate('teamMembers.user', 'name email');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Project ID is required' });
    }
    const project = await Project.findOne({
      _id: req.params.id,
      'teamMembers.user': req.user._id,
      'teamMembers.role': 'owner'
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }
    if (req.body.title) project.title = req.body.title;
    if (req.body.description) project.description = req.body.description;
    await project.save();
    res.json(project);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Project ID is required' });
    }
    const project = await Project.findOne({
      _id: req.params.id,
      'teamMembers.user': req.user._id,
      'teamMembers.role': 'owner'
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }
    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addTeamMember = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Project ID is required' });
    }
    if (!req.body.email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const project = await Project.findOne({
      _id: req.params.id,
      'teamMembers.user': req.user._id,
      'teamMembers.role': 'owner'
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMember = project.teamMembers.some(
      (member: ITeamMember) => member.user.toString() === user._id.toString()
    );
    if (isMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }
    project.teamMembers.push({ user: user._id, role: 'member' });
    await project.save();
    res.json(project);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const removeTeamMember = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const { id: projectId, userId } = req.params;
    if (!projectId || !userId) {
      return res.status(400).json({ message: 'Project ID and User ID are required' });
    }
    const project = await Project.findOne({
      _id: projectId,
      'teamMembers.user': req.user._id,
      'teamMembers.role': 'owner'
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }
    const memberToRemove = project.teamMembers.find(
      (member: ITeamMember) => member.user.toString() === userId
    );
    if (!memberToRemove) {
      return res.status(404).json({ message: 'Team member not found in this project' });
    }
    if (memberToRemove.role === 'owner') {
      return res.status(400).json({ message: 'Cannot remove the project owner' });
    }
    project.teamMembers = project.teamMembers.filter(
      (member: ITeamMember) => member.user.toString() !== userId
    );
    await project.save();
    res.json(project);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}; 