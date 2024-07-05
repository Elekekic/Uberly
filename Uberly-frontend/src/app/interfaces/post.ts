import { Comment } from "./comment";
import { Reaction } from "./reaction";
import { Tags } from "./tags";
import { User } from "./user";


export interface Post {
    id: number;
  title: string;
  description: string;
  startingPoint: string;
  endPoint: string;
  spacesRiders: number;
  tags: Tags[]; 
  vehicle: string;
  user: User; 
  comments: Comment[];
  reactions: Reaction[];
  usersWhoSaved: User[]; 
  showComments?: boolean;
}
