import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Subject } from '../models/subject';

@Injectable({
    providedIn: 'root',
})
export class SubjectService {
    constructor() {}

    private subjects: Subject[] = [
        {
            uuid: 'ae45dc89-8086-4f5d-8e68-f82e3a**295d0e',
            name: 'Webfejlesztési eszközök a gyakorlatban',
            code: 'IN1065SA',
            signupType: 'Kötelezően választható',
            requirementType: 'Gyakorlati jegy',
            interiorOrganization: 'TTIK Természettudományi és Informatikai Kar',
            recommendedTerm: 0,
            credit: 2,
            classesPerWeek: [
                {
                    courseType: 'Gyakorlat',
                    classesPerWeek: 2,
                },
            ],
        },
    ];

    private subjectsSubject = new BehaviorSubject<Subject[]>(
        this.subjects
    );

    getAllSubjects(): Observable<Subject[]> {
        return this.subjectsSubject.asObservable();
    }

    addSubject(subject: Omit<Subject, 'uuid'>): Promise<Subject> {
        const newSubject: Subject = {
            ...subject,
            uuid: uuidv4(),
        };

        this.subjects.push(newSubject);

        this.subjectsSubject.next([...this.subjects]);
        return new Promise((resolve) => resolve(newSubject));
    }

    editSubject(subject: Subject): void {
        this.subjects = this.subjects.map((s) =>
            s.uuid === subject.uuid ? subject : s
        );
        this.subjectsSubject.next([
            ...this.subjects
        ]);
    }
}
