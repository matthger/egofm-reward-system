import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProgressSpinner } from 'primeng/progressspinner';

import { selectAppIsLoading } from '../../state/app.selectors';

/**
 * LoadingSpinnerComponent displays a loading spinner when the application is in a loading state.
 */
@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  imports: [ProgressSpinner, NgIf, AsyncPipe],
})
export class LoadingSpinnerComponent {
  private readonly store: Store = inject(Store);

  isLoading$ = this.store.select(selectAppIsLoading);
}
