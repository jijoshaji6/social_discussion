import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

interface User {
  deactivated?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private db: AngularFireDatabase) {}

  getUsers(): Observable<any[]> {
    return this.db.list('/users').snapshotChanges();
  }

  getUsersExceptCurrentUser(currentUserId: string): Observable<any[]> {
    return this.db.list('/users').snapshotChanges().pipe(
      map(changes =>
        changes
          .map(c => {
            const user = c.payload.val() as any;
            return { key: c.payload.key, ...user };
          })
          .filter(user => user.key !== currentUserId)
      )
    );
  }

  getUserById(userId: string): Observable<any> {
    return this.db.object(`/users/${userId}`).valueChanges();
  }

  updateUser(userId: string, updatedUser: any): Observable<void> {
    return from(this.db.object(`/users/${userId}`).update(updatedUser)).pipe(
      catchError(error => from(Promise.reject(new Error('Failed to update user'))))
    );
  }

  deleteUser(userId: string): Observable<void> {
    return from(this.db.object(`/users/${userId}`).remove()).pipe(
      catchError(error => from(Promise.reject(new Error('Failed to delete user'))))
    );
  }

  deactivateUser(userId: string): Observable<void> {
    return from(this.db.object(`/users/${userId}`).update({ deactivated: true })).pipe(
      catchError(error => from(Promise.reject(new Error('Failed to deactivate user'))))
    );
  }

  activateUser(userId: string): Observable<void> {
    return from(this.db.object(`/users/${userId}`).update({ deactivated: false })).pipe(
      catchError(error => from(Promise.reject(new Error('Failed to activate user'))))
    );
  }

  toggleUser(userId: string): Observable<void> {
    return this.db.object<User>(`/users/${userId}`).valueChanges().pipe(
      switchMap(currentUser => {
        if (!currentUser || typeof currentUser.deactivated === 'undefined') {
          throw new Error('User not found or deactivated property is missing');
        }
        const updatedStatus = !currentUser.deactivated;
        return from(this.db.object(`/users/${userId}`).update({ deactivated: updatedStatus })).pipe(
          catchError(error => from(Promise.reject(new Error('Failed to update user status'))))
        );
      }),
      catchError(error => from(Promise.reject(new Error('Failed to toggle user status'))))
    );
  }
}
