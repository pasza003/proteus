import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { catchError, from, map, Observable } from 'rxjs';
import { Organisation, OrganisationCurriculums } from '../models/organisation';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class OrganisationService {
  private readonly collectionName = 'organisations';

  public readonly organisations$: Observable<Organisation[]>;

  constructor(
    private readonly firestore: Firestore,
    private readonly snackBarService: SnackbarService
  ) {
    this.organisations$ = this.getAll().pipe(
      catchError(() => {
        this.snackBarService.openErrorSnackbar('Error while loading organisations.');
        return [[]];
      })
    );
  }

  public getAll(): Observable<Organisation[]> {
    const organisationsRef = collection(this.firestore, this.collectionName);
    return collectionData(organisationsRef, { idField: 'id' }) as Observable<Organisation[]>;
  }

  public getById(id: string): Observable<Organisation | null> {
    return this.organisations$.pipe(map(organisation => organisation.find(o => o.id === id) ?? null));
  }

  public create(organisation: Organisation): void {
    const organisationsRef = collection(this.firestore, this.collectionName);
    from(addDoc(organisationsRef, organisation))
      .pipe(
        catchError(() => {
          this.snackBarService.openErrorSnackbar('Error while saving organisation.');
          return [];
        })
      )
      .subscribe(() => {
        this.snackBarService.openSuccessSnackbar('Successfully saved organisation.');
      });
  }

  public update(organisation: Organisation): void {
    const organisationDocRef = doc(this.firestore, `${this.collectionName}/${organisation.id}`);
    from(updateDoc(organisationDocRef, { ...organisation }))
      .pipe(
        catchError(() => {
          this.snackBarService.openErrorSnackbar('Error while editing organisation.');
          return [];
        })
      )
      .subscribe(() => {
        this.snackBarService.openSuccessSnackbar('Successfully edited organisation.');
      });
  }

  public delete(id: string): void {
    const organisationDocRef = doc(this.firestore, `${this.collectionName}/${id}`);
    from(deleteDoc(organisationDocRef))
      .pipe(
        catchError(() => {
          this.snackBarService.openErrorSnackbar('Error while deleting organisation.');
          return [];
        })
      )
      .subscribe(() => {
        this.snackBarService.openSuccessSnackbar('Successfully deleted organisation.');
      });
  }

  public getOrganisationCurriculumns(organisation: string): Observable<OrganisationCurriculums[]> {
    const collRef = collection(this.firestore, 'curriculum_organisation');
    const q = query(collRef, where('organisationId', '==', organisation));
    return collectionData(q, { idField: 'id' }) as Observable<OrganisationCurriculums[]>;
  }

  public linkCurriculumToOrganisation(organisationId: string, curriculumId: string): void {
    const collRef = collection(this.firestore, 'curriculum_organisation');

    const newLink = {
      organisationId,
      curriculumId,
    };

    from(addDoc(collRef, newLink))
      .pipe(
        catchError(() => {
          this.snackBarService.openErrorSnackbar('Error while linking curriculum.');
          return [];
        })
      )
      .subscribe(() => {
        this.snackBarService.openSuccessSnackbar('Successfully linked curriculum.');
      });
  }

  public deleteCurriculumLink(organisationId: string, curriculumId: string): void {
    const collRef = collection(this.firestore, 'curriculum_organisation');
    const q = query(collRef, where('organisationId', '==', organisationId), where('curriculumId', '==', curriculumId));

    from(
      getDocs(q).then(snapshot => {
        snapshot.forEach(docSnap => {
          const ref = doc(this.firestore, 'curriculum_organisation', docSnap.id);
          deleteDoc(ref);
        });
      })
    )
      .pipe(
        catchError(() => {
          this.snackBarService.openErrorSnackbar('Error while deleting linked curriculum.');
          return [];
        })
      )
      .subscribe(() => {
        this.snackBarService.openSuccessSnackbar('Successfully deleted linked curriculum.');
      });
  }
}
