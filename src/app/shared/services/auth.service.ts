import { Injectable } from '@angular/core';
import { Auth, browserSessionPersistence, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { doc, DocumentData, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { createUserWithEmailAndPassword, setPersistence } from 'firebase/auth';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { ProteusUser } from '../models/proteus-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: Observable<User | null>;

  constructor(
    private readonly firebaseAuth: Auth,
    private readonly firestore: Firestore
  ) {
    this.setSessionStoragePersistence();
    this.user$ = user(this.firebaseAuth);
  }

  private setSessionStoragePersistence(): void {
    setPersistence(this.firebaseAuth, browserSessionPersistence);
  }

  public register(userRequest: Omit<ProteusUser, 'role'>): Observable<void> {
    return from(createUserWithEmailAndPassword(this.firebaseAuth, userRequest.email, userRequest.password)).pipe(
      switchMap(credential => {
        const userRef = doc(this.firestore, 'users', credential.user.uid);
        return from(
          setDoc(userRef, {
            code: userRequest.code,
            role: 'USER',
          })
        );
      }),
      map(() => undefined)
    );
  }

  public login(email: string, password: string): Observable<void> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, email, password)).pipe(map(() => undefined));
  }

  public logout(): Observable<void> {
    return from(signOut(this.firebaseAuth)).pipe(map(() => sessionStorage.clear()));
  }

  public currentUser(): Observable<ProteusUser | null> {
    return this.user$.pipe(
      switchMap(userDoc => {
        if (!userDoc) return of(null);
        return this.getUserData(userDoc.uid).pipe(
          map(
            userData =>
              ({
                id: userDoc.uid,
                email: userDoc.email,
                ...userData,
              }) as unknown as ProteusUser
          )
        );
      })
    );
  }

  private getUserData(id: string): Observable<DocumentData | null> {
    const userDocRef = doc(this.firestore, 'users', id);
    return from(getDoc(userDocRef)).pipe(map(document => (document.exists() ? document.data() : null)));
  }
}
