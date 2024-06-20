import { Meme } from "./meme";
import { Post } from "./post";
import { Reaction } from "./reaction";
import { Reply } from "./reply";
import { User } from "./user";

export interface Comment {
    id: number,
    post : Post | null,
    meme : Meme | null,
    user : User,
    replies : Reply[],
    reactions : Reaction[]
}
