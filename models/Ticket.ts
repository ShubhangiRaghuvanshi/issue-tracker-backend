import mongoose from 'mongoose';
import {Document,Schema}from 'mongoose';
export interface ITicket extends Document {
  title: string;
    description: string;
    status: 'open' | 'in-progress' | 'closed';
    priority: 'low' | 'medium' | 'high';
      assignee?: mongoose.Schema.Types.ObjectId;
  projectId: mongoose.Schema.Types.ObjectId;
  createdBy: mongoose.Schema.Types.ObjectId;
}
const ticketSchema=new Schema<ITicket>({
    title:{ type: String, required: true },
    description:{ type: String, required: true },
    status:{ type: String, enum: ['open', 'in-progress', 'closed'], required: true },
    priority:{ type: String, enum: ['low', 'medium', 'high'], required: true },
    assignee:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});
export default mongoose.model<ITicket>('Ticket', ticketSchema);