import { Component, inject } from '@angular/core';
import { WorkspaceService } from './workspace.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html'
})
export class App {
  readonly workspace = inject(WorkspaceService);
}
