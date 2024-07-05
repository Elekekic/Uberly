import { Comment } from "./comment";
import { Reaction } from "./reaction";
import { User } from "./user";

export interface Reply {
    id: number,
    content: String, 
    commentId: number,
    user: User,
    reactions: Reaction[]
}
