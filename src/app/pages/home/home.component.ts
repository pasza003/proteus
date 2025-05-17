import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatListModule, MatNavList } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ProteusUser } from '../../shared/models/proteus-user';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [MatNavList, RouterLink, MatListModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly authService = inject(AuthService);

  public readonly user: Signal<ProteusUser | null>;

  constructor() {
    const user$: Observable<ProteusUser | null> = this.authService.currentUser();
    this.user = toSignal(user$, { initialValue: null });
  }
}
