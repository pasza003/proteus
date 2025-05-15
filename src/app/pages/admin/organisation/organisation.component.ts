import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Curriculum } from '../../../shared/models/curriculum';
import { OrganisationWithCurriculums } from '../../../shared/models/organisation';
import { CurriculumService } from '../../../shared/services/curriculum.service';
import { OrganisationService } from './../../../shared/services/organisation.service';

@Component({
  selector: 'app-organisation',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './organisation.component.html',
  styleUrl: './organisation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationComponent {
  private readonly organisationService = inject(OrganisationService);
  private readonly curriculumService = inject(CurriculumService);
  private readonly router = inject(Router);

  public readonly data = input.required<OrganisationWithCurriculums>();
  public readonly curriculumDisplayedColumns: string[] = ['code', 'name', 'terms', 'requiredCredit', 'actions'];

  public readonly curriculumLinkForm = new FormGroup({
    curriculumId: new FormControl('', [Validators.required]),
  });
  public readonly allCurriculums: Signal<Curriculum[]> = toSignal(this.curriculumService.curriculums$, { initialValue: [] });
  public readonly unlinkedCurriculums = computed(() => {
    const linkedIds = new Set(this.data().curriculums.map(c => c.id));
    return this.allCurriculums().filter(c => !linkedIds.has(c.id));
  });

  constructor() {
    effect(() => {
      const hasUnlinked = this.unlinkedCurriculums().length > 0;
      const control = this.curriculumLinkForm.get('curriculumId');

      if (hasUnlinked) {
        control?.enable({ emitEvent: false });
      } else {
        control?.disable({ emitEvent: false });
      }
    });
  }

  public computeOrganisationName(): string {
    return `${this.data().organisation.name} (${this.data().organisation.code})`;
  }

  public add(): void {
    if (this.curriculumLinkForm.valid) {
      this.organisationService.linkCurriculumToOrganisation(this.data().organisation.id, this.curriculumLinkForm.value.curriculumId!);
      this.refreshRoute();
    }
  }

  public delete(curriculum: Curriculum): void {
    this.organisationService.deleteCurriculumLink(this.data().organisation.id, curriculum.id);
    this.refreshRoute();
  }

  private refreshRoute(): void {
    const currentUrl = this.router.url;
    this.curriculumLinkForm.setValue({ curriculumId: null });
    this.router.navigate([currentUrl]);
  }
}
