import { Injectable } from '@angular/core';
import { Curriculum } from '../models/curriculum';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
    providedIn: 'root',
})
export class CurriculumService {
    constructor() {}

    private curriculums: Curriculum[] = [
        {
            uuid: '816d823e-609f-4ef8-b59a-57904cc0230b',
            code: 'BSZKUFO-N1',
            name: 'Üzemmérnök-informatikus BProf_N',
            terms: 6,
            requiredCredit: 180,
        },
    ];

    private curriculumSubject = new BehaviorSubject<Curriculum[]>(
        this.curriculums
    );

    getAllCurriculums(): Observable<Curriculum[]> {
        return this.curriculumSubject.asObservable();
    }

    addCurriculum(curriculum: Omit<Curriculum, 'uuid'>): Promise<Curriculum> {
        const newCurriculum: Curriculum = {
            ...curriculum,
            uuid: uuidv4(),
        };

        this.curriculums.push(newCurriculum);

        this.curriculumSubject.next([...this.curriculums]);
        return new Promise((resolve) => resolve(newCurriculum));
    }

    editCurriculum(curriculum: Curriculum): void {
        this.curriculums = this.curriculums.map((c) =>
            c.uuid === curriculum.uuid ? curriculum : c
        );

        this.curriculumSubject.next([
            ...this.curriculums
        ]);
    }
}
