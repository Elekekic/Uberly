
import { Reaction } from "./reaction";
import { Reply } from "./reply";
import { User } from "./user";

export interface Comment {
    id: number;
    postId?: number;
    memeId?: number;
    content: string;
    user: User;
    replies: Reply[];
    reactions: Reaction[];
  }
