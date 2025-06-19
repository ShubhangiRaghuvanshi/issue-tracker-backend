import express,{Response} from 'express';
import { createTicket, getTicketsByProject, getTicket,updateTicket,deleteTicket } from '../controllers/ticket';
import { auth,AuthRequest } from '../middleware/auth';
const router = express.Router();

router.post('/', auth, (req:AuthRequest,res:Response)=>createTicket(req,res));
router.get('/', auth, (req:AuthRequest,res:Response)=>getTicketsByProject(req,res));
router.get('/:id', auth, (req:AuthRequest,res:Response)=>getTicket(req,res));
router.put('/:id', auth, (req:AuthRequest,res:Response)=>updateTicket(req,res));
router.delete('/:id', auth, (req:AuthRequest,res:Response)=>deleteTicket(req,res));

export default router;
