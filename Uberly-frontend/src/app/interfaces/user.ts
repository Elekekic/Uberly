import { Feedbacks } from "./feedbacks";
import { Meme } from "./meme";
import { Post } from "./post";

export interface User {
    id: number;
    username: String ;
    name: String ;
    surname: String ;
    email: String ;
    password: String ;
    bio: String ;
    pictureProfile: String | null ;
    pronouns: String ;
    feedbacksAuthored: Feedbacks[];
    feedbacksReceived: Feedbacks[];
    role: String;
    posts: Post[];
    favorites: Post[];
    favoritesMemes: Meme[];
    memes: Meme[];
    followers: User[];
    following: User[];
}
