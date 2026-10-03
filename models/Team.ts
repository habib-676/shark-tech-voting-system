export interface Team {
  _id: string;
  name: string;
  votes: number;
  averageRating: number;
  description: string;
  isLive: boolean;
  votedUsers?: string[];
}
