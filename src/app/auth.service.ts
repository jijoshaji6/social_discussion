import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { from, Observable } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router
  ) {}

  signup(email: string, password: string, username: string, isAdmin: boolean = false): Observable<void> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
      switchMap(({ user }) => {
        if (user) {
          const newUser = { email, username, isAdmin };
          return from(this.db.object(`users/${user.uid}`).set(newUser)).pipe(
            switchMap(() => from((user as firebase.User).updateProfile({ displayName: username }))),
            map(() => void 0)
          );
        }
        return from(Promise.reject(new Error('User not created')));
      })
    );
  }

  login(email: string, password: string): Observable<void> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      map(() => void 0)
    );
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut()).pipe(
      map(() => {
        this.router.navigate(['/login']);
        return void 0;
      })
    );
  }

  getCurrentUser(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }

  getUserData(uid: string): Observable<any> {
    return this.db.object(`users/${uid}`).valueChanges();
  }

  updateUser(updatedUser: any): Observable<void> {
    return this.getCurrentUser().pipe(
      switchMap(user => {
        if (user) {
          return from(this.db.object(`users/${user.uid}`).update(updatedUser)).pipe(
            switchMap(() => from((user as firebase.User).updateProfile({ displayName: updatedUser.username }))),
            map(() => void 0),
            catchError(error => from(Promise.reject(new Error('Failed to update user'))))
          );
        }
        return from(Promise.reject(new Error('No user logged in')));
      })
    );
  }
}
