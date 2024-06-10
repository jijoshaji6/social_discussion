import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../community.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  communities: any[] = [];
  newCommunity: any = { name: '', description: '' };
  searchQuery: string = '';
  filteredCommunities: any[] = [];

  constructor(private communityService: CommunityService) { }

  ngOnInit() {
    this.communityService.getCommunities().subscribe(data => {
      this.communities = data;
      this.filteredCommunities = data;
    });
  }

  createCommunity() {
    this.communityService.createCommunity(this.newCommunity);
    this.newCommunity = { name: '', description: '' };
  }

  filterCommunities() {
    if (this.searchQuery) {
      this.filteredCommunities = this.communities.filter(community =>
        community.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredCommunities = this.communities;
    }
  }
}
