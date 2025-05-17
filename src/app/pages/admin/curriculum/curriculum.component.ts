import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Curriculum, CurriculumWithSubjects } from '../../../shared/models/curriculum';
import { Subject } from '../../../shared/models/subject';
import { CurriculumService } from '../../../shared/services/curriculum.service';
import { SubjectService } from '../../../shared/services/subject.service';

@Component({
  selector: 'app-curriculum',
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
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.scss',
})
export class CurriculumComponent {
  private readonly curriculumService = inject(CurriculumService);
  private readonly subjectService = inject(SubjectService);
  private readonly router = inject(Router);

  public readonly data = input.required<CurriculumWithSubjects>();
  public readonly subjectDisplayedColumns: string[] = [
    'name',
    'code',
    'signupType',
    'requirementType',
    'interiorOrganization',
    'recommendedTerm',
    'credit',
    'actions',
  ];

  public readonly subjectLinkForm = new FormGroup({
    subjectId: new FormControl('', [Validators.required]),
  });
  public readonly allSubjects: Signal<Subject[]> = toSignal(this.subjectService.subjects$, { initialValue: [] });
  public readonly unlinkedSubjects = computed(() => {
    const linkedIds = new Set(this.data().subjects.map(c => c.id));
    return this.allSubjects().filter(c => !linkedIds.has(c.id));
  });

  constructor() {
    effect(() => {
      const hasUnlinked = this.unlinkedSubjects().length > 0;
      const control = this.subjectLinkForm.get('subjectId');

      if (hasUnlinked) {
        control?.enable({ emitEvent: false });
      } else {
        control?.disable({ emitEvent: false });
      }
    });
  }

  public computeCurriculumName(): string {
    return `${this.data().curriculum.name} (${this.data().curriculum.code})`;
  }

  public add(): void {
    if (this.subjectLinkForm.valid) {
      this.curriculumService.linkSubjectToCurriculum(this.data().curriculum.id, this.subjectLinkForm.value.subjectId!);
      this.refreshRoute();
    }
  }

  public delete(curriculum: Curriculum): void {
    this.curriculumService.deleteSubjectLink(this.data().curriculum.id, curriculum.id);
    this.refreshRoute();
  }

  private refreshRoute(): void {
    const currentUrl = this.router.url;
    this.subjectLinkForm.setValue({ subjectId: null });
    this.router.navigate([currentUrl]);
  }
}
