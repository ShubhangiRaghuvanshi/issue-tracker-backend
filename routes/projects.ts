import express, { Response } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember
} from '../controllers/projectController';

const router = express.Router();

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log('Project Route:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
});

// Project routes
router.post('/', auth, (req: AuthRequest, res: Response) => createProject(req, res));
router.get('/', auth, (req: AuthRequest, res: Response) => getProjects(req, res));
router.get('/:id', auth, (req: AuthRequest, res: Response) => getProject(req, res));
router.patch('/:id', auth, (req: AuthRequest, res: Response) => updateProject(req, res));
router.delete('/:id', auth, (req: AuthRequest, res: Response) => deleteProject(req, res));

// Team member routes
router.post('/:id/members', auth, (req: AuthRequest, res: Response) => addTeamMember(req, res));
router.delete('/:id/members/:userId', auth, (req: AuthRequest, res: Response) => removeTeamMember(req, res));

export default router; 