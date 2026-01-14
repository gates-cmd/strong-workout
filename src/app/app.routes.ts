import { Routes } from '@angular/router';
import { SessionListComponent } from './components/session-list-component/session-list-component';
import { NewSessionComponent } from './components/new-session-component/new-session-component';
import { ProgressBarComponent } from './components/progress-bar-component/progress-bar-component';

export const routes: Routes = [
  { path: '', component: SessionListComponent },
  { path: 'new-session', component: NewSessionComponent },
  { path: 'edit-session/:id', component: NewSessionComponent },
  { path: 'progress-bars', component: ProgressBarComponent},
  { path: '**', redirectTo: '' }
];