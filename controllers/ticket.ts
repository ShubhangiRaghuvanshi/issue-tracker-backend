import {Request,Response} from 'express';
import Ticket from '../models/Ticket';
import Project  from '../models/Project';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

export const createTicket=async(req:AuthRequest,res:Response): Promise<Response>=>{
    try{
        const {title,description,status,priority,assignee,projectId}=req.body;
          console.log("Incoming Ticket Body:", req.body);
    console.log("Authenticated User:", req.user);
        const ticket=await Ticket.create({
            title,
            description,
            status,
            priority,
            assignee,
            projectId,
            createdBy:req.user?._id
        });
        // Populate assignee and createdBy before returning
        const populatedTicket = await Ticket.findById(ticket._id).populate('assignee','name email').populate('createdBy','name email');
        return  res.status(201).json(populatedTicket);
    }catch(error){
      return res.status(500).json({ message: error instanceof Error ? error.message : 'Error creating ticket' });
    }

 }
 export const getTicketsByProject=async(req:AuthRequest,res:Response): Promise<Response>=>{
    try{
        const {projectId, status, priority, assignee, search} = req.query;
        if(!projectId){
            return res.status(400).json({message:'Project ID is required'});
        }
        // Build filter object
        const filter: any = { projectId: new mongoose.Types.ObjectId(projectId as string) };
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (assignee) filter.assignee = assignee;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const tickets=await Ticket.find(filter).populate('assignee','name email').populate('createdBy','name email');
        return res.status(200).json(tickets);
    }catch(error){
        return res.status(500).json({message:'Error fetching tickets'});
    }
 }
 export const getTicket=async(req:AuthRequest,res:Response): Promise<Response>=>{
    try{
        const {id}=req.params;
        const ticket=await Ticket.findById(id).populate('assignee','name email').populate('createdBy','name email');
        if(!ticket){
            return res.status(404).json({message:'Ticket not found'});
        }
        return res.status(200).json(ticket);
    }catch(error){
        return res.status(500).json({message:'Error fetching ticket'});
    }
}
export const updateTicket=async(req:AuthRequest,res:Response): Promise<Response>=>{

    try{
        const {id}=req.params;
        const {title,description,status,priority,assignee}=req.body;
        const ticket=await Ticket.findByIdAndUpdate(id,{
            title,
            description,
            status,
            priority,
            assignee
        },{new:true});
        if(!ticket){
            return res.status(404).json({message:'Ticket not found'});
        }
        // Populate assignee and createdBy before returning
        const populatedTicket = await Ticket.findById(ticket._id).populate('assignee','name email').populate('createdBy','name email');
        return res.status(200).json(populatedTicket);
    }catch(error){
        return res.status(500).json({message:'Error updating ticket'});
    }
}
export const deleteTicket=async(req:AuthRequest,res:Response): Promise<Response>=>{
    try{
        const {id}=req.params;
        const ticket=await Ticket.findByIdAndDelete(id);
        if(!ticket){
            return res.status(404).json({message:'Ticket not found'});
        }
        return res.status(200).json({message:'Ticket deleted successfully'});
    }catch(error){
        return res.status(500).json({message:'Error deleting ticket'});
    }
}
