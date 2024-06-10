import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post, Comment } from './models'; // Import interfaces

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  constructor(private db: AngularFireDatabase) { }

  getCommunities(): Observable<any[]> {
    return this.db.list('communities').snapshotChanges().pipe(
      map(changes => changes.map(c => ({
        key: c.payload.key,
        ...(c.payload.val() as any)
      })))
    );
  }

  getCommunityById(id: string): Observable<any> {
    return this.db.object(`/communities/${id}`).valueChanges();
  }

  getPosts(communityId: string): Observable<Post[]> {
    return this.db.object(`communities/${communityId}`).valueChanges().pipe(
      map((community: any) => {
        const posts = community?.posts || {};
        return Object.values(posts).map((post: any) => ({
          ...post,
          comments: Object.values(post.comments || {}).map((comment: any) => ({
            ...comment,
            id: comment.id || Math.random().toString(36).substring(2)
          }))
        }));
      })
    );
  }

  createPost(communityId: string, post: any): Promise<void> {
    return this.db.object(`/communities/${communityId}/posts/${post.id}`).update(post);
  }

  createCommunity(community: any): Promise<void> {
    return this.db.list('communities').push(community).then(() => { });
  }

  updateCommunity(id: string, data: any): Promise<void> {
    return this.db.object(`/communities/${id}`).update(data);
  }

  deleteCommunity(communityId: string): Observable<void> {
    return from(this.db.object(`communities/${communityId}`).remove()).pipe(map(() => { }));
  }

  deletePost(postId: string): Observable<void> {
    return this.db.list('communities').snapshotChanges().pipe(
      map(changes => changes.forEach(c => {
        const key = c.payload.key;
        const posts = ((c.payload.val() as any).posts || []).filter((post: any) => post.id !== postId);
        this.db.object(`communities/${key}`).update({ posts });
      }))
    ).pipe(map(() => { }));
  }

  deleteComment(postId: string, commentId: string): Observable<void> {
    return this.db.list('communities').snapshotChanges().pipe(
      map(changes => changes.forEach(c => {
        const key = c.payload.key;
        const posts = ((c.payload.val() as any).posts || []).map((post: any) => {
          if (post.id === postId) {
            post.comments = post.comments.filter((comment: any) => comment.id !== commentId);
          }
          return post;
        });
        this.db.object(`communities/${key}`).update({ posts });
      }))
    ).pipe(map(() => { }));
  }

  hidePost(postId: string): Observable<void> {
    return this.db.list('communities').snapshotChanges().pipe(
      map(changes => changes.forEach(c => {
        const key = c.payload.key;
        const posts = ((c.payload.val() as any).posts || []).map((post: any) => {
          if (post.id === postId) {
            post.hidden = true;
          }
          return post;
        });
        this.db.object(`communities/${key}`).update({ posts });
      }))
    ).pipe(map(() => { }));
  }

  hideComment(postId: string, commentId: string): Observable<void> {
    return this.db.list('communities').snapshotChanges().pipe(
      map(changes => changes.forEach(c => {
        const key = c.payload.key;
        const posts = ((c.payload.val() as any).posts || []).map((post: any) => {
          if (post.id === postId) {
            post.comments = post.comments.map((comment: any) => {
              if (comment.id === commentId) {
                comment.hidden = true;
              }
              return comment;
            });
          }
          return post;
        });
        this.db.object(`communities/${key}`).update({ posts });
      }))
    ).pipe(map(() => { }));
  }
}
