import { Routes } from '@angular/router';
import { ChangeDetectionPage, ImageLabPage, InsightsPage, OverviewPage, ProfilePage, ProjectPage, ResearchPage } from './pages';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: 'overview', component: OverviewPage, title: 'Overview · DRISVIA' },
  { path: 'change-detection', component: ChangeDetectionPage, title: 'Change Detection · DRISVIA' },
  { path: 'insights', component: InsightsPage, title: 'Insights · DRISVIA' },
  { path: 'research', component: ResearchPage, title: 'Research Notes · DRISVIA' },
  { path: 'image-lab', component: ImageLabPage, title: 'Image Lab · DRISVIA' },
  { path: 'profile', component: ProfilePage, title: 'Profile · DRISVIA' },
  { path: 'project', component: ProjectPage, title: 'Project Proposal · DRISVIA' },
  { path: '**', redirectTo: 'overview' }
];
