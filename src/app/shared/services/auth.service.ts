import { Injectable } from '@angular/core';
import { Auth, browserSessionPersistence, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { doc, DocumentData, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, setPersistence } from 'firebase/auth';
import { catchError, from, map, Observable, of, pipe, switchMap } from 'rxjs';
import { ProteusUser } from '../models/proteus-user';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: Observable<User | null>;

  constructor(
    private readonly firebaseAuth: Auth,
    private readonly firestore: Firestore,
    private readonly snackbarService: SnackbarService,
    private readonly router: Router
  ) {
    this.setSessionStoragePersistence();
    this.user$ = user(this.firebaseAuth);
  }

  private setSessionStoragePersistence(): void {
    setPersistence(this.firebaseAuth, browserSessionPersistence);
  }

  public register(userRequest: Omit<ProteusUser, 'role'>): void {
    from(createUserWithEmailAndPassword(this.firebaseAuth, userRequest.email, userRequest.password))
      .pipe(
        switchMap(credential => {
          const userRef = doc(this.firestore, 'users', credential.user.uid);
          return from(
            setDoc(userRef, {
              code: userRequest.code,
              role: 'USER',
            })
          );
        }),
        pipe(
          catchError(error => {
            this.snackbarService.openErrorSnackbar(this.getRegisterErrorMessage(error.code));
            return [];
          })
        )
      )
      .subscribe(() => {
        this.router.navigateByUrl('/home');
        this.snackbarService.openSuccessSnackbar('Registration successfull!');
      });
  }

  private getRegisterErrorMessage(errorCode: unknown): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Email address already in use';
      default:
        return 'Registration failed. Please try again later.';
    }
  }

  public login(email: string, password: string): void {
    from(signInWithEmailAndPassword(this.firebaseAuth, email, password))
      .pipe(
        catchError(error => {
          this.snackbarService.openErrorSnackbar(this.getLoginErrorMessage(error.code));
          return [];
        })
      )
      .subscribe(() => {
        this.router.navigateByUrl('/home');
        this.snackbarService.openSuccessSnackbar('Login successfull!');
      });
  }

  private getLoginErrorMessage(errorCode: unknown): string {
    switch (errorCode) {
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      default:
        return 'Authentication failed. Please try again later.';
    }
  }

  public logout(): void {
    from(signOut(this.firebaseAuth))
      .pipe(
        catchError(error => {
          this.snackbarService.openErrorSnackbar('Logout failed.');
          return [];
        })
      )
      .subscribe(() => {
        sessionStorage.clear();
        this.snackbarService.openSuccessSnackbar('Logout successful.');
        this.router.navigate(['/home']);
      });
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
