import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnDestroy, Signal, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { ProteusUser } from '../../models/proteus-user';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, RouterLink, MatExpansionModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnDestroy {
  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  public readonly isMobile = signal(true);
  public readonly user: Signal<ProteusUser | null>;

  constructor(private readonly authService: AuthService) {
    this.user = toSignal(this.authService.currentUser(), { initialValue: null });

    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 800px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = (): void => this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  public isAdmin(): boolean {
    return this.user()?.role === 'ADMIN';
  }

  public isUser(): boolean {
    return this.user()?.role === 'USER';
  }

  public isAuthenticated(): boolean {
    return this.user() !== null;
  }

  public logout(): void {
    this.authService.logout();
  }

  public ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
