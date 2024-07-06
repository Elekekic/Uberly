import { Comment } from "./comment";
import { Reaction } from "./reaction";
import { Tags } from "./tags";
import { User } from "./user";

export interface Meme {
    id: number,
    tag: Tags,
    url: String,
    user: User,
    comments : Comment[],
    reactions : Reaction[],
    usersWhoSaved : User[]
}
