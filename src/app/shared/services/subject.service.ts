import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, documentId, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { catchError, from, Observable, of } from 'rxjs';
import { Subject } from '../models/subject';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private readonly collectionName = 'subjects';

  public readonly subjects$: Observable<Subject[]>;

  constructor(
    private readonly firestore: Firestore,
    private readonly snackBarService: SnackbarService
  ) {
    this.subjects$ = this.getAll().pipe(
      catchError(() => {
        this.snackBarService.openErrorSnackbar('Error while loading subjects.');
        return [[]];
      })
    );
  }

  public getAll(): Observable<Subject[]> {
    const subjectsRef = collection(this.firestore, this.collectionName);
    return collectionData(subjectsRef, { idField: 'id' }) as Observable<Subject[]>;
  }

  public getById(id: string): Observable<Subject> {
    const subjectDocRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(subjectDocRef, { idField: 'id' }) as Observable<Subject>;
  }

  public create(subject: Subject): void {
    const subjectsRef = collection(this.firestore, this.collectionName);
    from(addDoc(subjectsRef, subject))
      .pipe(
        catchError(() => {
          this.snackBarService.openErrorSnackbar('Error while saving subject.');
          return [];
        })
      )
      .subscribe(() => {
        this.snackBarService.openSuccessSnackbar('Successfully saved subject.');
      });
  }

  public update(subject: Subject): void {
    const subjectDocRef = doc(this.firestore, `${this.collectionName}/${subject.id}`);
    from(updateDoc(subjectDocRef, { ...subject }))
      .pipe(
        catchError(() => {
          this.snackBarService.openErrorSnackbar('Error while editing subject.');
          return [];
        })
      )
      .subscribe(() => {
        this.snackBarService.openSuccessSnackbar('Successfully edited subject.');
      });
  }

  public delete(id: string): void {
    const subjectDocRef = doc(this.firestore, `${this.collectionName}/${id}`);
    from(deleteDoc(subjectDocRef))
      .pipe(
        catchError(() => {
          this.snackBarService.openErrorSnackbar('Error while deleting subject.');
          return [];
        })
      )
      .subscribe(() => {
        this.snackBarService.openSuccessSnackbar('Successfully deleted subject.');
      });
  }

  public filter(subjectIds: string[]): Observable<Subject[]> {
    if (!subjectIds.length) return of([]);

    const collRef = collection(this.firestore, 'subjects');
    const q = query(collRef, where(documentId(), 'in', subjectIds));
    return collectionData(q, { idField: 'id' }) as Observable<Subject[]>;
  }
}
