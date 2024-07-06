import { Tags } from './tags';

export interface PostDto {
  title: string;
  description: string;
  startingPoint: string;
  endPoint: string;
  spacesRiders: number;
  tags: Tags[];
  vehicle: string;
  userId: number;
}
