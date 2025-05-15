import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { Curriculum } from '../../../../shared/models/curriculum';
import { OrganisationCurriculums, OrganisationWithCurriculums } from '../../../../shared/models/organisation';
import { CurriculumService } from '../../../../shared/services/curriculum.service';
import { OrganisationService } from '../../../../shared/services/organisation.service';

export const selectedOrganisationResolver: ResolveFn<OrganisationWithCurriculums | RedirectCommand> = (route, _) => {
  const organisationService = inject(OrganisationService);
  const curriculumService = inject(CurriculumService);
  const router = inject(Router);

  const organisationId = route.paramMap.get('organisationId')!;

  return organisationService.getById(organisationId).pipe(
    switchMap(organisation => {
      if (!organisation) {
        return of(new RedirectCommand(router.createUrlTree(['/admin/organisations'])));
      }

      return organisationService.getOrganisationCurriculumns(organisationId).pipe(
        map((orgCurriculums: OrganisationCurriculums[]) => orgCurriculums.map(rel => rel.curriculumId)),
        switchMap((curriculumIds: string[]) =>
          curriculumService.filter(curriculumIds).pipe(
            map((curriculums: Curriculum[]) => ({
              organisation: organisation!,
              curriculums,
            }))
          )
        )
      );
    })
  );
};
