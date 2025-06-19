declare module '../models/User' {
  import { Document } from 'mongoose';
  
  export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface IUserMethods {
    // Add any custom methods here
  }

  const User: any;
  export default User;
}

declare module '../models/Project' {
  import { Document } from 'mongoose';
  import { IUser } from './User';

  export interface ITeamMember {
    user: IUser['_id'];
    role: 'owner' | 'member';
  }

  export interface IProject extends Document {
    title: string;
    description: string;
    teamMembers: ITeamMember[];
    createdAt: Date;
    updatedAt: Date;
  }

  export interface IProjectMethods {
    // Add any custom methods here
  }

  const Project: any;
  export default Project;
} 