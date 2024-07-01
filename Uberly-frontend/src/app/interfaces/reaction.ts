import { Comment } from './comment';
import { Feedbacks } from './feedbacks';
import { Meme } from './meme';
import { Post } from './post';
import { Reactiontypes } from './reactiontypes';
import { Reply } from './reply';
import { User } from './user';

export interface Reaction {
  id?: number;
  userId: number;
  type: Reactiontypes;
  comment?: Comment;
  feedback?: Feedbacks;
  postId?: number;
  reply?: Reply;
  meme?: Meme;
}
