import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../community.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

interface Comment {
  content: string;
  timestamp: Date;
}

interface Post {
  id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}

@Component({
  selector: 'app-community-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './community-page.component.html',
  styleUrls: ['./community-page.component.css']
})
export class CommunityPageComponent implements OnInit {
  community: any;
  posts: Post[] = [];
  newPostContent: string = '';
  communityId!: string;

  constructor(
    private route: ActivatedRoute,
    private communityService: CommunityService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const communityId = params.get('id');
      if (communityId) {
        this.communityId = communityId;
        this.communityService.getCommunityById(communityId).subscribe(data => {
          this.community = data;
          this.loadPosts(communityId).subscribe(posts => {
            this.posts = posts.map(post => ({ ...post, hasUpvoted: false, hasDownvoted: false }));
          });
        });
      }
    });
  }

  loadPosts(communityId: string): Observable<Post[]> {
    return this.communityService.getPosts(communityId);
  }

  upvote(postId: string, post: Post) {
    if (!post.hasUpvoted) {
      post.upvotes += 1;
      post.hasUpvoted = true;
      this.communityService.updateCommunity(this.communityId, { posts: this.posts });
    }
  }

  downvote(postId: string, post: Post) {
    if (!post.hasDownvoted) {
      post.downvotes += 1;
      post.hasDownvoted = true;
      this.communityService.updateCommunity(this.communityId, { posts: this.posts });
    }
  }

  addComment(postId: string, commentContent: string) {
    const post = this.posts.find(p => p.id === postId);
    if (post && commentContent) {
      post.comments = post.comments || [];
      post.comments.push({ content: commentContent, timestamp: new Date() });
      this.communityService.updateCommunity(this.communityId, { posts: this.posts });
    }
  }

  onEnter(postId: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const commentContent = inputElement.value;
    if (commentContent.trim()) {
      this.addComment(postId, commentContent);
      inputElement.value = '';
    }
  }

  createPost() {
    if (this.newPostContent.trim() && this.communityId) {
      const newPost: Post = {
        id: Math.random().toString(36).substring(2),
        content: this.newPostContent,
        upvotes: 0,
        downvotes: 0,
        comments: [],
        hasUpvoted: false,
        hasDownvoted: false
      };
      this.communityService.createPost(this.communityId, newPost)
      this.newPostContent = '';
    } 
  }
}
