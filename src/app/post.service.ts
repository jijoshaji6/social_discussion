import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: any[] = [];

  constructor() {}

  getPosts(): any[] {
    return [...this.posts];
  }

  getPostById(postId: string): any {
    return this.posts.find(post => post.id === postId);
  }

  createPost(post: any): void {
    const newPost = {
      id: Math.random().toString(36).substring(2),
      ...post
    };
    this.posts.push(newPost);
  }

  updatePost(postId: string, updatedPost: any): void {
    const index = this.posts.findIndex(post => post.id === postId);
    if (index !== -1) {
      this.posts[index] = { ...this.posts[index], ...updatedPost };
    }
  }

  deletePost(postId: string): void {
    this.posts = this.posts.filter(post => post.id !== postId);
  }
}
