import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

// Interface for Team Member
export interface ITeamMember {
  user: IUser['_id'];
  role: 'owner' | 'member';
}

// Interface for Project document
export interface IProject extends Document {
  title: string;
  description: string;
  teamMembers: ITeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Project methods (if needed)
export interface IProjectMethods {
  // Add any custom methods here
}

// Create the schema
const projectSchema = new Schema<IProject, IProjectMethods>({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  teamMembers: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'member'],
      default: 'member'
    }
  }]
}, {
  timestamps: true
});

// Create and export the model
const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project; 