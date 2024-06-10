import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../community.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-moderation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-moderation.component.html',
  styleUrls: ['./content-moderation.component.css']
})
export class ContentModerationComponent implements OnInit {
  communities: any[] = [];
  posts: any[] = [];
  visibleComments: { [key: string]: boolean } = {};
  postVisibilityStatus: { [key: string]: boolean } = {}; // Add this
  selectedCommunityId: string | null = null;
  selectedCommunityName: string | null = null;

  constructor(
    private communityService: CommunityService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCommunities();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        this.selectedCommunityId = id;
        this.loadCommunityDetails(id);
        this.loadPosts(id);
      } else {
        this.selectedCommunityId = null;
        this.selectedCommunityName = null;
        this.posts = [];
      }
    });
  }

  loadCommunities() {
    this.communityService.getCommunities().subscribe(data => {
      this.communities = data;
      console.log('Communities loaded:', this.communities);
    });
  }

  loadCommunityDetails(communityId: string) {
    this.communityService.getCommunityById(communityId).subscribe(data => {
      this.selectedCommunityName = data.name;
      console.log('Community details loaded:', data);
    });
  }

  loadPosts(communityId: string) {
    this.communityService.getPosts(communityId).subscribe(data => {
      this.posts = data;
      console.log('Posts loaded:', this.posts);
    });
  }

  toggleCommentsVisibility(postId: string) {
    this.visibleComments[postId] = !this.visibleComments[postId];
  }

  togglePostVisibility(postId: string) {
    this.postVisibilityStatus[postId] = !this.postVisibilityStatus[postId];
  }

  deletePost(postId: string) {
    if (this.selectedCommunityId) {
      this.communityService.deletePost(postId).subscribe(() => {
        this.loadPosts(this.selectedCommunityId!); // Reload posts after deletion
      });
    }
  }

  hidePost(postId: string) {
    if (this.selectedCommunityId) {
      this.communityService.hidePost(postId).subscribe(() => {
        this.togglePostVisibility(postId);
      });
    }
  }

  deleteComment(postId: string, commentId: string) {
    if (this.selectedCommunityId) {
      this.communityService.deleteComment(postId, commentId).subscribe(() => {
        this.loadPosts(this.selectedCommunityId!); 
      });
    }
  }

  hideComment(postId: string, commentId: string) {
    if (this.selectedCommunityId) {
      this.communityService.hideComment(postId, commentId).subscribe(() => {
        this.loadPosts(this.selectedCommunityId!); 
      });
    }
  }

  selectCommunity(communityId: string) {
    this.router.navigate(['/content', communityId]);
  }
}
