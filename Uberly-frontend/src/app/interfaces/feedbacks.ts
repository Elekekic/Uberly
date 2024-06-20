import { Reaction } from "./reaction";
import { User } from "./user";


export interface Feedbacks {
    id: number;
    content: string;
    reactions: Reaction[];
    author: User;
    recipient: User;
}
