import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { CurriculumSubjects, CurriculumWithSubjects } from '../../../../shared/models/curriculum';
import { Subject } from '../../../../shared/models/subject';
import { CurriculumService } from '../../../../shared/services/curriculum.service';
import { SubjectService } from '../../../../shared/services/subject.service';

export const selectedCurriculumResolver: ResolveFn<CurriculumWithSubjects | RedirectCommand> = (route, _) => {
  const curriculumService = inject(CurriculumService);
  const subjectService = inject(SubjectService);
  const router = inject(Router);

  const curriculumId = route.paramMap.get('curriculumId')!;

  return curriculumService.getById(curriculumId).pipe(
    switchMap(curriculum => {
      if (!curriculum) {
        return of(new RedirectCommand(router.createUrlTree(['/admin/curriculums'])));
      }

      return curriculumService.getCurriculumnSubjects(curriculumId).pipe(
        map((curSubjects: CurriculumSubjects[]) => curSubjects.map(rel => rel.subjectId)),
        switchMap((subjectIds: string[]) =>
          subjectService.filter(subjectIds).pipe(
            map((subjects: Subject[]) => ({
              curriculum: curriculum!,
              subjects,
            }))
          )
        )
      );
    })
  );
};
