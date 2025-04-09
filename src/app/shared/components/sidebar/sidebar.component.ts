import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnDestroy, inject, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-sidebar',
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnDestroy {
    protected readonly fillerNav = [
        'Home',
        'Curriculum',
        'Organisations',
        'Terms',
        'Subjects',
    ];

    protected readonly isMobile = signal(true);

    private readonly _mobileQuery: MediaQueryList;
    private readonly _mobileQueryListener: () => void;

    constructor() {
        const media = inject(MediaMatcher);

        this._mobileQuery = media.matchMedia('(max-width: 600px)');
        this.isMobile.set(this._mobileQuery.matches);
        this._mobileQueryListener = () =>
            this.isMobile.set(this._mobileQuery.matches);
        this._mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    ngOnDestroy(): void {
        this._mobileQuery.removeEventListener(
            'change',
            this._mobileQueryListener
        );
    }
}
