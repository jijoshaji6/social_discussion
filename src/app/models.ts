export interface Comment {
    id: string;
    content: string;
    timestamp: Date;
  }
  
  export interface Post {
    id: string;
    content: string;
    upvotes: number;
    downvotes: number;
    comments: Comment[];
    hasUpvoted: boolean;
    hasDownvoted: boolean;
  }
  