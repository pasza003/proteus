import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  documentId,
  Firestore,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { catchError, from, Observable, of } from 'rxjs';
import { Curriculum, CurriculumSubjects } from '../models/curriculum';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class CurriculumService {
  private readonly collectionName = 'curriculums';

  public readonly curriculums$: Observable<Curriculum[]>;

  constructor(
    private readonly firestore: Firestore,
    private readonly snackBarService: SnackbarService
  ) {
    this.curriculums$ = this.getAll().pipe(
      catchError(() => {
        this.snackBarService.openErrorSnackbar('Error while loading curriculums.');
        return [[]];
      })
    );
  }

  public getAll(): Observable<Curriculum[]> {
    const curriculumsRef = collection(this.firestore, this.collectionName);
    return collectionData(curriculumsRef, { idField: 'id' }) as Observable<Curriculum[]>;
  }

  public getById(id: string): Observable<Curriculum> {
    const curriculumDocRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(curriculumDocRef, { idField: 'id' }) as Observable<Curriculum>;
  }

  public create(curriculum: Curriculum): void {
    const curriculumsRef = collection(this.firestore, this.collectionName);
    from(addDoc(curriculumsRef, curriculum))
      .pipe(
        catchError(() => {
          this.snackBarService.openErrorSnackbar('Error while saving curriculum.');
          return [];
        })
      )
      .subscribe(() => {
        this.snackBarService.openSuccessSnackbar('Successfully saved curriculum.');
      });
  }

  public update(curriculum: Curriculum): void {
    const curriculumDocRef = doc(this.firestore, `${this.collectionName}/${curriculum.id}`);
    from(updateDoc(curriculumDocRef, { ...curriculum }))
      .pipe(
        catchError(() => {
          this.snackBarService.openErrorSnackbar('Error while editing curriculum.');
          return [];
        })
      )
      .subscribe(() => {
        this.snackBarService.openSuccessSnackbar('Successfully edited curriculum.');
      });
  }

  public delete(id: string): void {
    const curriculumDocRef = doc(this.firestore, `${this.collectionName}/${id}`);
    from(deleteDoc(curriculumDocRef))
      .pipe(
        catchError(() => {
          this.snackBarService.openErrorSnackbar('Error while deleting curriculum.');
          return [];
        })
      )
      .subscribe(() => {
        this.snackBarService.openSuccessSnackbar('Successfully deleted curriculum.');
      });
  }

  public filter(curriculumIds: string[]): Observable<Curriculum[]> {
    if (!curriculumIds.length) return of([]);

    const collRef = collection(this.firestore, 'curriculums');
    const q = query(collRef, where(documentId(), 'in', curriculumIds));
    return collectionData(q, { idField: 'id' }) as Observable<Curriculum[]>;
  }

  public getCurriculumnSubjects(curriculum: string): Observable<CurriculumSubjects[]> {
    const collRef = collection(this.firestore, 'curriculum_subject');
    const q = query(collRef, where('curriculumId', '==', curriculum));
    return collectionData(q, { idField: 'id' }) as Observable<CurriculumSubjects[]>;
  }

  public linkSubjectToCurriculum(curriculumId: string, subjectId: string): void {
    const collRef = collection(this.firestore, 'curriculum_subject');

    const newLink = {
      curriculumId,
      subjectId,
    };

    from(addDoc(collRef, newLink))
      .pipe(
        catchError(() => {
          this.snackBarService.openErrorSnackbar('Error while linking subject.');
          return [];
        })
      )
      .subscribe(() => {
        this.snackBarService.openSuccessSnackbar('Successfully linked subject.');
      });
  }

  public deleteSubjectLink(curriculumId: string, subjectId: string): void {
    const collRef = collection(this.firestore, 'curriculum_subject');
    const q = query(collRef, where('curriculumId', '==', curriculumId), where('subjectId', '==', subjectId));

    from(
      getDocs(q).then(snapshot => {
        snapshot.forEach(docSnap => {
          const ref = doc(this.firestore, 'curriculum_subject', docSnap.id);
          deleteDoc(ref);
        });
      })
    )
      .pipe(
        catchError(() => {
          this.snackBarService.openErrorSnackbar('Error while deleting linked subject.');
          return [];
        })
      )
      .subscribe(() => {
        this.snackBarService.openSuccessSnackbar('Successfully deleted linked subject.');
      });
  }
}
