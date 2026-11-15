import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { WorkspaceService } from './workspace.service';

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="presentation-hero"><div class="hero-visual"><img class="hero-image" [src]="workspace.afterImage()" alt="Satellite-style aerial sample imagery"><div class="hero-image-wash"></div><div class="hero-image-top"><span>EARTH OBSERVATION</span><span>RESEARCH PROPOSAL · 01</span></div><div class="hero-image-pair"><button type="button" class="hero-pair-item" aria-label="Open earlier image preview" (click)="openPreview(workspace.beforeImage(), 'Earlier image')"><img [src]="workspace.beforeImage()" alt="Earlier sample image"><span>EARLIER · VIEW</span></button><span class="hero-pair-arrow">→</span><button type="button" class="hero-pair-item" aria-label="Open later image preview" (click)="openPreview(workspace.afterImage(), 'Later image')"><img [src]="workspace.afterImage()" alt="Later sample image"><span>LATER · VIEW</span></button></div><div class="hero-image-caption"><span class="caption-dot"></span> Illustrative sample imagery · not a model result</div></div><div class="hero-copy"><div class="eyebrow"><span></span> PROJECT PROPOSAL <span class="hero-index">01 / 04</span></div><h1>Read the landscape.<br><em>Understand change.</em></h1><p class="hero-lead">A deep-learning framework for multi-temporal satellite image analysis—designed to explore seasonal robustness and cross-region generalization.</p><div class="hero-keywords"><span>REMOTE SENSING</span><span>CHANGE DETECTION</span><span>ENVIRONMENTAL MONITORING</span></div><div class="hero-actions"><button class="project-select-cta" [class.is-selected]="workspace.projectSelected()" [attr.aria-pressed]="workspace.projectSelected()" (click)="openProject()">{{ workspace.projectSelected() ? 'Project selected · View proposal' : 'Select this project' }} <span>{{ workspace.projectSelected() ? '✓' : '↗' }}</span></button><a class="hero-secondary-cta" routerLink="/image-lab">Explore image lab <span>→</span></a></div><p class="selection-note">{{ workspace.projectSelected() ? 'Selection saved in this browser.' : 'A presentation-ready research proposal for review.' }}</p></div></section>
    @if (preview(); as imagePreview) { <div class="image-lightbox" role="dialog" aria-modal="true" [attr.aria-label]="imagePreview.label" (click)="closePreview()"><div class="lightbox-content" (click)="$event.stopPropagation()"><button class="lightbox-close" type="button" aria-label="Close image preview" (click)="closePreview()">×</button><img [src]="imagePreview.url" [alt]="imagePreview.label"><p>{{ imagePreview.label }} · illustrative sample imagery</p></div></div> }
    <div class="demo-banner"><span>✳</span><div><strong>Research preview.</strong> Sample imagery is illustrative. No model inference or experimental results are claimed.</div><button class="banner-export" (click)="workspace.exportSummary()">Export proposal ↓</button></div>
    <section class="proposal-highlights"><article class="highlight-card"><span class="highlight-number">01</span><div><small>THE RESEARCH GAP</small><h2>Seasonal shifts can obscure real change.</h2><p>Lighting, vegetation cycles, and geographic differences challenge reliable satellite comparisons.</p></div><span class="highlight-mark">◒</span></article><article class="highlight-card"><span class="highlight-number">02</span><div><small>THE PROPOSED CONTRIBUTION</small><h2>Test robustness beyond one region.</h2><p>Explore season-aware features and evaluate whether detection transfers across locations.</p></div><span class="highlight-mark">⌖</span></article><article class="highlight-card"><span class="highlight-number">03</span><div><small>THE EVIDENCE PLAN</small><h2>Measure performance, not promises.</h2><p>Compare with baselines using F1, IoU, seasonal tests, and ablation studies.</p></div><span class="highlight-mark">↗</span></article></section>
    <div class="overview-section-heading"><div><span>PROJECT WORKSPACE</span><h2>Research plan & study materials</h2></div><span>DRISVIA · EARTH INTELLIGENCE</span></div>
    <div class="overview-grid">
      <section class="card project-card"><div class="section-kicker">STUDY AT A GLANCE <span>/ 01</span></div><div class="project-title"><div><h2>{{ workspace.region || 'Untitled study' }}</h2><p>Multi-temporal satellite image comparison</p></div><span class="status-pill">● &nbsp; {{ workspace.projectSelected() ? 'Selected' : 'Draft' }}</span></div>
        <div class="project-stats"><div><span>IMAGE PAIR</span><strong>{{ workspace.imageADate }} <i>→</i> {{ workspace.imageBDate }}</strong></div><div><span>DATASET</span><strong>{{ workspace.dataset }}</strong></div><div><span>MODEL</span><strong>{{ workspace.model }}</strong></div></div>
        <div class="overview-image-row"><div class="mini-preview"><img [src]="workspace.beforeImage()" alt="Earlier study image"><span>IMAGE A · EARLIER</span></div><div class="mini-preview"><img [src]="workspace.afterImage()" alt="Later study image"><span>IMAGE B · LATER</span></div></div>
        <a class="inline-link" routerLink="/change-detection">Open image comparison <span>→</span></a>
      </section>
      <section class="card study-details"><div class="section-kicker">STUDY DETAILS <span>/ 02</span></div><h2>One place for the essentials.</h2><p>Keep the study context with your image pair.</p>
        <label>Study area<input [(ngModel)]="workspace.region" placeholder="City, region, or coordinates"></label>
        <div class="date-fields"><label>Image A date<input type="date" [(ngModel)]="workspace.imageADate"></label><label>Image B date<input type="date" [(ngModel)]="workspace.imageBDate"></label></div>
        <label>Dataset<input [(ngModel)]="workspace.dataset" placeholder="Dataset or source"></label>
        <label>Research notes<textarea [(ngModel)]="workspace.notes" rows="3" placeholder="Add context, caveats, and study notes"></textarea></label>
        <a class="maps-link" [href]="workspace.mapsUrl()" target="_blank" rel="noopener noreferrer">⌖ &nbsp; Open study area in Google Maps <span>↗</span></a>
      </section>
      <section class="card workflow-card"><div><div class="section-kicker">PROPOSED WORKFLOW <span>/ 03</span></div><h2>From imagery to insight</h2><p>Four steps to a reproducible change analysis.</p></div><div class="workflow-steps"><div><b>01</b><strong>Acquire</strong><span>Source a multi-temporal image pair.</span></div><div><b>02</b><strong>Prepare</strong><span>Register and normalize imagery.</span></div><div><b>03</b><strong>Detect</strong><span>Run a validated segmentation model.</span></div><div><b>04</b><strong>Evaluate</strong><span>Compare predictions with ground truth.</span></div></div></section>
      <section class="card quick-chat"><div class="section-kicker">RESEARCH ASSISTANT <span>/ 04</span></div><h2>A question about your study?</h2><p>Ask about methods, datasets, or evaluation. Answers use the project’s research guidance and are not generated by a connected AI service.</p><form (ngSubmit)="ask()"><input name="question" [(ngModel)]="question" placeholder="Try “Which metrics should I report?”"><button type="submit">Ask <span>→</span></button></form>@if (workspace.answer()) { <div class="answer-box"><strong>Research guidance</strong><p>{{ workspace.answer() }}</p></div> }</section>
    </div>`
})
export class OverviewPage {
  readonly workspace = inject(WorkspaceService);
  private readonly router = inject(Router);
  readonly preview = signal<{ url: string; label: string } | null>(null);
  question = '';

  openProject() {
    if (!this.workspace.projectSelected()) this.workspace.toggleProjectSelection();
    this.router.navigate(['/project']);
  }

  openPreview(url: string, label: string) { this.preview.set({ url, label }); }
  closePreview() { this.preview.set(null); }
  ask() { this.workspace.ask(this.question); this.question = ''; }
}

@Component({
  selector: 'app-change-detection-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-heading"><div><div class="eyebrow"><span></span> IMAGE ANALYSIS / 01</div><h1>Change <em>detection.</em></h1><p>Compare a registered image pair visually. Model inference is not connected.</p></div><button class="export-btn" (click)="workspace.exportSummary()">↓ &nbsp; Export study</button></div>
    <div class="demo-banner"><span>✳</span><div><strong>Visual comparison only.</strong> The image pair below is not analyzed by an AI model; illustrative overlays are unavailable for uploaded imagery.</div></div>
    <section class="card comparison-card"><div class="comparison-heading"><div><div class="section-kicker">BI-TEMPORAL COMPARISON <span>/ 01</span></div><h2>{{ workspace.region || 'Study area' }}</h2><p>Use the slider to compare Image A and Image B.</p></div><div class="mode-tabs"><button [class.selected]="mode() === 'split'" (click)="mode.set('split')">Swipe</button><button [class.selected]="mode() === 'side'" (click)="mode.set('side')">Side by side</button><button [class.selected]="mode() === 'a'" (click)="mode.set('a')">Image A</button><button [class.selected]="mode() === 'b'" (click)="mode.set('b')">Image B</button></div></div>
      <div class="comparison-stage" [class.side-view]="mode() === 'side'" [class.single-a]="mode() === 'a'" [class.single-b]="mode() === 'b'">
        <div class="stage-image image-b"><img [src]="workspace.afterImage()" [alt]="'Image B: ' + workspace.afterName()"><span class="image-label"><small>IMAGE B · LATER</small><strong>{{ workspace.afterName() }}</strong><em>{{ workspace.imageBDate }}</em></span></div>
        @if (mode() !== 'b' && mode() !== 'side') { <div class="stage-image image-a" [style.width.%]="mode() === 'a' ? 100 : split()"><img [src]="workspace.beforeImage()" [alt]="'Image A: ' + workspace.beforeName()" [style.width]="mode() === 'split' ? (10000 / split()) + '%' : '100%'"><span class="image-label"><small>IMAGE A · EARLIER</small><strong>{{ workspace.beforeName() }}</strong><em>{{ workspace.imageADate }}</em></span></div> }
        @if (mode() === 'side') { <div class="side-by-side"><div class="side-image"><img [src]="workspace.beforeImage()" [alt]="workspace.beforeName()"><span class="image-label"><small>IMAGE A · EARLIER</small><strong>{{ workspace.beforeName() }}</strong><em>{{ workspace.imageADate }}</em></span></div><div class="side-image"><img [src]="workspace.afterImage()" [alt]="workspace.afterName()"><span class="image-label"><small>IMAGE B · LATER</small><strong>{{ workspace.afterName() }}</strong><em>{{ workspace.imageBDate }}</em></span></div></div> }
        @if (mode() === 'split') { <div class="comparison-handle" [style.left.%]="split()"><span>‹ │ ›</span></div><input class="comparison-range" type="range" min="5" max="95" [ngModel]="split()" (ngModelChange)="split.set(+$event)" aria-label="Adjust comparison slider"> }
      </div>
      <div class="compare-foot"><span>⌖ {{ workspace.region || 'Study area not set' }}</span><span>Imagery: {{ workspace.hasUploads() ? 'User uploads' : 'Pexels sample imagery' }} · Not georeferenced</span></div>
      <div class="upload-section"><div class="upload-heading"><div><h3>Choose your image pair</h3><p>Images are held in this browser session and are not uploaded to a server.</p></div>@if (workspace.hasUploads()) { <button class="text-button" (click)="workspace.resetSample()">Reset sample</button> }</div><div class="upload-row"><label class="upload-card"><span class="upload-icon">↑</span><span><small>IMAGE A · EARLIER</small><strong>{{ workspace.beforeName() }}</strong><em>Choose an image</em></span><span class="upload-plus">+</span><input type="file" accept="image/*" (change)="workspace.upload($event, 'before')"></label><label class="upload-card"><span class="upload-icon">↑</span><span><small>IMAGE B · LATER</small><strong>{{ workspace.afterName() }}</strong><em>Choose an image</em></span><span class="upload-plus">+</span><input type="file" accept="image/*" (change)="workspace.upload($event, 'after')"></label></div></div>
    </section>
    <div class="analysis-note"><strong>Not a model prediction</strong><span>Meaningful change detection requires aligned, georeferenced images and a trained model. This page currently supports visual review only.</span></div>`
})
export class ChangeDetectionPage {
  readonly workspace = inject(WorkspaceService);
  readonly mode = signal<'split' | 'side' | 'a' | 'b'>('split');
  readonly split = signal(50);
}

@Component({
  selector: 'app-insights-page',
  standalone: true,
  template: `
    <div class="page-heading"><div><div class="eyebrow"><span></span> RESEARCH ANALYTICS / 02</div><h1>Measure what <em>matters.</em></h1><p>Evaluation views for a rigorous, reproducible study.</p></div><span class="outline-pill">ILLUSTRATIVE DASHBOARD</span></div>
    <div class="demo-banner"><span>✳</span><div><strong>No results reported.</strong> Charts are schematic examples only. Metrics below require model predictions and ground-truth labels.</div></div>
    <div class="analytics-grid"><section class="card chart-card"><div class="chart-header"><div><div class="section-kicker">CHANGE COMPOSITION <span>/ 01</span></div><h2>Area by class</h2><p>Example category mix — not measured data</p></div><span class="chart-label">EXAMPLE</span></div><div class="donut-layout"><div class="donut-chart"><div><strong>—</strong><span>NO DATA</span></div></div><div class="chart-legend"><div><i class="legend-urban"></i><span>Urban development</span><b>—</b></div><div><i class="legend-vegetation"></i><span>Vegetation change</span><b>—</b></div><div><i class="legend-water"></i><span>Water & land use</span><b>—</b></div><div><i class="legend-other"></i><span>Other / uncertain</span><b>—</b></div></div></div><div class="chart-footnote">A class area breakdown will be available after inference.</div></section>
      <section class="card chart-card"><div class="chart-header"><div><div class="section-kicker">PIXEL CONFIDENCE <span>/ 02</span></div><h2>Confidence distribution</h2><p>Illustrative histogram — no confidence scores</p></div><span class="chart-label">EXAMPLE</span></div><div class="histogram"><div class="hist-y"><span>HIGH</span><span>MED</span><span>LOW</span></div><div class="hist-bars"><i style="height:18%"></i><i style="height:33%"></i><i style="height:46%"></i><i style="height:64%"></i><i style="height:78%"></i><i style="height:88%"></i><i style="height:74%"></i><i style="height:55%"></i><i style="height:37%"></i><i style="height:24%"></i><i style="height:15%"></i><i style="height:8%"></i></div></div><div class="axis-labels"><span>0.0</span><span>MODEL CONFIDENCE</span><span>1.0</span></div><div class="chart-footnote">Bars show a visual placeholder, not a model output.</div></section>
      <section class="card metric-table-card"><div class="chart-header"><div><div class="section-kicker">MODEL EVALUATION <span>/ 03</span></div><h2>Performance metrics</h2><p>Report against annotated hold-out data.</p></div><span class="chart-label">NOT EVALUATED</span></div><div class="metric-table"><div class="metric-row metric-head"><span>METRIC</span><span>VALUE</span><span>WHAT IT TELLS YOU</span></div><div class="metric-row"><strong>Precision</strong><b>—</b><span>How many predicted changes are correct</span></div><div class="metric-row"><strong>Recall</strong><b>—</b><span>How many true changes are detected</span></div><div class="metric-row"><strong>F1-score</strong><b>—</b><span>Balance between precision and recall</span></div><div class="metric-row"><strong>IoU</strong><b>—</b><span>Overlap of predicted and true change regions</span></div><div class="metric-row"><strong>Pixel accuracy</strong><b>—</b><span>Overall fraction of correctly labeled pixels</span></div></div></section>
      <section class="card evaluation-card"><div class="section-kicker">RECOMMENDED EXPERIMENTS <span>/ 04</span></div><h2>Build evidence, not assumptions.</h2><div class="experiment-list"><div><span>01</span><div><strong>Seasonal robustness</strong><p>Compare false positives across seasonal image pairs.</p></div><b>PLANNED</b></div><div><span>02</span><div><strong>Cross-region generalization</strong><p>Train and evaluate on different geographic regions.</p></div><b>PLANNED</b></div><div><span>03</span><div><strong>Ablation study</strong><p>Measure each proposed component’s contribution.</p></div><b>PLANNED</b></div></div></section>
    </div>`
})
export class InsightsPage {}

@Component({
  selector: 'app-research-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-heading"><div><div class="eyebrow"><span></span> RESEARCH NOTES / 03</div><h1>Ask better <em>questions.</em></h1><p>Keep the research gap, method, and evidence in one place.</p></div><button class="export-btn" (click)="workspace.exportSummary()">↓ &nbsp; Export study</button></div>
    <div class="research-layout"><section class="card research-brief"><div class="section-kicker">RESEARCH DIRECTION <span>/ 01</span></div><h2>Beyond a standard change map.</h2><p class="research-lead">Study whether seasonal variation resistance and cross-region generalization can improve multi-temporal change detection.</p><div class="brief-chips"><span>SEASONAL ROBUSTNESS</span><span>GEOGRAPHIC GENERALIZATION</span><span>URBAN + ENVIRONMENTAL MONITORING</span></div><div class="research-divider"></div><div class="question-block"><span>THE RESEARCH GAP</span><p>Seasonal conditions, sensor differences, and geographic shifts can cause false detections or reduce model transferability.</p></div><div class="question-block"><span>THE PROPOSED CONTRIBUTION</span><p>Evaluate a season-aware approach across held-out geographic regions against clearly defined baselines.</p></div><div class="question-block"><span>THE EVIDENCE NEEDED</span><p>Baseline comparison, seasonal testing, cross-region testing, ablation study, and computational cost analysis.</p></div></section>
      <section class="card assistant-card"><div class="assistant-top"><span class="assistant-symbol">✳</span><div><div class="section-kicker">DRISVIA RESEARCH ASSISTANT</div><p>Research guidance · Not connected to an external AI model</p></div><span class="local-badge">LOCAL DEMO</span></div><div class="assistant-welcome"><strong>What would you like to explore?</strong><p>Ask about datasets, evaluation metrics, seasonality, or research methodology. Replies are based on built-in guidance, not live AI inference.</p><div class="suggestion-list"><button (click)="ask('Which datasets are suitable for seasonal change detection?')">Which datasets support seasonal analysis? <span>↗</span></button><button (click)="ask('Which metrics should I report?')">Which evaluation metrics should I report? <span>↗</span></button><button (click)="ask('How can I test cross-region generalization?')">How do I test cross-region generalization? <span>↗</span></button></div></div>@for (item of workspace.questions(); track $index) { <div class="chat-message"><div class="user-message">{{ item.question }}</div><div class="agent-message"><strong>Research guidance</strong><p>{{ item.answer }}</p></div></div> }<form class="assistant-form" (ngSubmit)="submit()"><input name="question" [(ngModel)]="question" placeholder="Ask a research question…" aria-label="Ask a research question"><button type="submit" [disabled]="!question.trim()">Ask <span>→</span></button></form><small class="assistant-disclaimer">Do not treat responses as model output or a substitute for literature review.</small></section>
    </div>
    <section class="card dataset-card"><div class="section-kicker">DATASET STARTING POINTS <span>/ 02</span></div><h2>Choose data to match the research question.</h2><div class="dataset-grid"><div><strong>LEVIR-CD</strong><span>Building changes</span><small>Bi-temporal optical imagery · Binary annotations</small></div><div><strong>WHU-CD</strong><span>Building changes</span><small>Large-scale building change benchmark</small></div><div><strong>S2Looking</strong><span>Viewing conditions</span><small>Building changes across varying angles</small></div><div><strong>CDD · OSCD</strong><span>Seasonal / multispectral</span><small>Investigate domain fit and annotation availability</small></div></div><p class="dataset-caveat">Verify dataset access, licenses, geographic coverage, and label suitability before using in a study.</p></section>`
})
export class ResearchPage {
  readonly workspace = inject(WorkspaceService);
  question = '';
  ask(text: string) { this.workspace.ask(text); }
  submit() { this.ask(this.question); this.question = ''; }
}

@Component({
  selector: 'app-image-lab-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-heading"><div><div class="eyebrow"><span></span> VISUAL COMPARISON STUDIO / 04</div><h1>Bring two moments <em>together.</em></h1><p>Upload an earlier and a newer image, then inspect them side by side or with a swipe.</p></div><button class="export-btn" (click)="workspace.exportSummary()">↓ &nbsp; Export study</button></div>
    <div class="lab-layout"><section class="card lab-uploader"><div class="section-kicker">01 / YOUR IMAGE PAIR</div><h2>Choose two images to compare.</h2><p class="lab-intro">Select a previous image and the newer image of the same place. The preview updates as each file is read in your browser.</p><div class="upload-row lab-upload-row"><label class="upload-card lab-upload-card"><span class="upload-icon">↑</span><span><small>PREVIOUS IMAGE</small><strong>{{ workspace.beforeName() }}</strong><em>{{ workspace.hasUploads() && workspace.beforeName() !== 'Sample image A' ? 'Click to replace' : 'Choose previous image' }}</em></span><span class="upload-plus">+</span><input type="file" accept="image/*" (change)="workspace.upload($event, 'before')"></label><label class="upload-card lab-upload-card"><span class="upload-icon">↑</span><span><small>NEW IMAGE</small><strong>{{ workspace.afterName() }}</strong><em>{{ workspace.hasUploads() && workspace.afterName() !== 'Sample image B' ? 'Click to replace' : 'Choose newer image' }}</em></span><span class="upload-plus">+</span><input type="file" accept="image/*" (change)="workspace.upload($event, 'after')"></label></div>
      @if (workspace.processing() === 'reading') { <div class="read-progress"><div><span>Reading image in this browser</span><strong>{{ workspace.progress() }}%</strong></div><div class="progress-track"><i [style.width.%]="workspace.progress()"></i></div></div> }
      <div class="lab-fields"><label>Study area<input [(ngModel)]="workspace.region" placeholder="City, region, or coordinates"></label><label>Earlier image date<input type="date" [(ngModel)]="workspace.imageADate"></label><label>Newer image date<input type="date" [(ngModel)]="workspace.imageBDate"></label></div>
      <div class="lab-actions"><button class="primary-action" [disabled]="!workspace.pairReady()" (click)="saveComparison()">Save comparison to history <span>→</span></button><button class="text-button" (click)="workspace.resetSample()">Reset sample</button></div>
      <div class="processing-steps"><div [class.step-complete]="workspace.pairReady()"><span>01</span><strong>Images selected</strong><small>{{ workspace.pairReady() ? 'Both files read in this browser' : 'Waiting for both images' }}</small></div><div [class.step-complete]="workspace.pairReady()"><span>02</span><strong>Visual preview</strong><small>{{ workspace.pairReady() ? 'Ready to inspect' : 'Appears after both uploads' }}</small></div><div class="step-pending"><span>03</span><strong>AI change analysis</strong><small>Not connected in this demo</small></div></div>
      <p class="privacy-note">Your image files are previewed locally in this tab. They are not sent to a server, and no AI inference is performed.</p>
    </section>
    <section class="card lab-preview"><div class="preview-heading"><div><div class="section-kicker">02 / VISUAL REVIEW</div><h2>{{ workspace.region || 'Study area' }}</h2></div><div class="mode-tabs"><button [class.selected]="mode() === 'split'" (click)="mode.set('split')">Swipe</button><button [class.selected]="mode() === 'side'" (click)="mode.set('side')">Side by side</button><button [class.selected]="mode() === 'a'" (click)="mode.set('a')">Previous</button><button [class.selected]="mode() === 'b'" (click)="mode.set('b')">New</button></div></div>
      <div class="comparison-stage lab-stage" [class.side-view]="mode() === 'side'" [class.single-a]="mode() === 'a'" [class.single-b]="mode() === 'b'"><div class="stage-image image-b"><img [src]="workspace.afterImage()" [alt]="'New image: ' + workspace.afterName()"><span class="image-label"><small>NEW IMAGE</small><strong>{{ workspace.afterName() }}</strong><em>{{ workspace.imageBDate }}</em></span></div>@if (mode() !== 'b' && mode() !== 'side') { <div class="stage-image image-a" [style.width.%]="mode() === 'a' ? 100 : split()"><img [src]="workspace.beforeImage()" [alt]="'Previous image: ' + workspace.beforeName()" [style.width]="mode() === 'split' ? (10000 / split()) + '%' : '100%'"><span class="image-label"><small>PREVIOUS IMAGE</small><strong>{{ workspace.beforeName() }}</strong><em>{{ workspace.imageADate }}</em></span></div> }@if (mode() === 'side') { <div class="side-by-side"><div class="side-image"><img [src]="workspace.beforeImage()" [alt]="workspace.beforeName()"><span class="image-label"><small>PREVIOUS IMAGE</small><strong>{{ workspace.beforeName() }}</strong><em>{{ workspace.imageADate }}</em></span></div><div class="side-image"><img [src]="workspace.afterImage()" [alt]="workspace.afterName()"><span class="image-label"><small>NEW IMAGE</small><strong>{{ workspace.afterName() }}</strong><em>{{ workspace.imageBDate }}</em></span></div></div> }@if (mode() === 'split') { <div class="comparison-handle" [style.left.%]="split()"><span>‹ │ ›</span></div><input class="comparison-range" type="range" min="5" max="95" [ngModel]="split()" (ngModelChange)="split.set(+$event)" aria-label="Adjust image comparison slider"> }</div>
      <div class="preview-legend"><span><i></i> Previous image</span><span><i></i> New image</span><span class="legend-caption">Visual comparison only · Not a detected change map</span></div>
      <a class="maps-link" [href]="workspace.mapsUrl()" target="_blank" rel="noopener noreferrer">⌖ &nbsp; Open study area in Google Maps <span>↗</span></a>
    </section></div>`
})
export class ImageLabPage {
  readonly workspace = inject(WorkspaceService);
  readonly mode = signal<'split' | 'side' | 'a' | 'b'>('split');
  readonly split = signal(50);
  saveComparison() {
    this.workspace.addHistory('Image comparison saved', `${this.workspace.region} · ${this.workspace.beforeName()} → ${this.workspace.afterName()}`, 'comparison');
  }
}

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page-heading"><div><div class="eyebrow"><span></span> RESEARCHER PROFILE / 05</div><h1>Your work, <em>all in one place.</em></h1><p>Manage your local profile and revisit recent image comparisons and research questions.</p></div><span class="local-badge">SAVED IN THIS BROWSER</span></div>
    <div class="profile-layout"><section class="card profile-card"><div class="section-kicker">PROFILE DETAILS <span>/ 01</span></div><div class="profile-intro"><div class="profile-avatar">{{ initials }}</div><div><h2>{{ workspace.profile().name || 'Researcher' }}</h2><p>DRISVIA research workspace</p></div></div><label>Display name<input [(ngModel)]="name" name="name" placeholder="Your name"></label><label>Email address<input [(ngModel)]="email" name="email" type="email" placeholder="you&#64;example.edu"></label><label>Research focus<textarea [(ngModel)]="researchFocus" name="researchFocus" rows="3" placeholder="Urban change, seasonal variation…"></textarea></label><button class="primary-action" (click)="saveProfile()">Save profile <span>→</span></button><p class="privacy-note">Profile and activity are stored only in this browser on this device.</p></section>
      <section class="card history-card"><div class="history-heading"><div><div class="section-kicker">RECENT ACTIVITY <span>/ 02</span></div><h2>Your search history</h2><p>Image uploads, saved comparisons, and research questions.</p></div>@if (workspace.history().length) { <button class="text-button" (click)="workspace.clearHistory()">Clear history</button> }</div>
        @if (workspace.history().length) { <div class="history-list">@for (item of workspace.history(); track item.createdAt + item.detail) { <article class="history-item"><span class="history-icon">{{ item.type === 'question' ? '?' : item.type === 'comparison' ? '↔' : '↑' }}</span><div><strong>{{ item.title }}</strong><p>{{ item.detail }}</p><time>{{ formatDate(item.createdAt) }}</time></div><a routerLink="/image-lab" aria-label="Open image lab">↗</a></article> }</div> } @else { <div class="history-empty"><span>◷</span><strong>No activity yet</strong><p>Upload an image pair, save a comparison, or ask a research question and it’ll appear here.</p><a routerLink="/image-lab">Open image lab <span>→</span></a></div> }
      </section></div>`
})
export class ProfilePage {
  readonly workspace = inject(WorkspaceService);
  name = this.workspace.profile().name;
  email = this.workspace.profile().email;
  researchFocus = this.workspace.profile().researchFocus;
  get initials() { return this.name.trim().split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'R'; }
  saveProfile() {
    this.workspace.profile.set({ name: this.name.trim() || 'Researcher', email: this.email.trim(), researchFocus: this.researchFocus.trim() });
    this.workspace.saveProfile();
  }
  formatDate(value: string) { return new Date(value).toLocaleString(); }
}

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a class="project-back-link" routerLink="/overview">← Back to overview</a>
    <div class="page-heading project-page-heading"><div><div class="eyebrow"><span></span> DRISVIA · PROJECT PROPOSAL</div><h1>Robust change detection <em>across time and place.</em></h1><p>A research proposal for satellite image analysis under seasonal and geographic variation.</p></div><span class="selection-status">{{ workspace.projectSelected() ? '✓ PROJECT SELECTED' : 'PROPOSAL VIEW' }}</span></div>
    <div class="project-abstract"><div><span>PROJECT ABSTRACT</span><p>This project investigates a deep-learning framework for identifying meaningful geographical change between multi-temporal satellite images. It focuses on reducing confusion from seasonal variation and testing performance across different regions, with visual comparison and a reproducible evaluation plan.</p></div><div class="abstract-facts"><div><small>RESEARCH AREA</small><strong>Remote sensing · Deep learning</strong></div><div><small>PROPOSED FOCUS</small><strong>Seasonal robustness · Cross-region transfer</strong></div><div><small>PROJECT STAGE</small><strong>Proposal · Experiments pending</strong></div></div></div>
    <section class="project-detail-grid"><article class="card project-detail-card"><div class="section-kicker">RESEARCH OBJECTIVES <span>/ 01</span></div><h2>Questions the study will answer</h2><ol class="objective-list"><li><span>01</span>Can a model distinguish seasonal appearance changes from persistent land-cover change?</li><li><span>02</span>How well does performance transfer between geographic regions?</li><li><span>03</span>Which model components improve robustness in controlled ablation studies?</li><li><span>04</span>What accuracy and inference costs are achievable on the selected benchmarks?</li></ol></article><article class="card project-detail-card"><div class="section-kicker">PROPOSED CONTRIBUTION <span>/ 02</span></div><h2>A testable research direction</h2><p class="detail-body">Evaluate season-aware feature learning and geographic generalization against established bi-temporal change-detection baselines.</p><div class="contribution-tags"><span>SEASON-AWARE EVALUATION</span><span>HELD-OUT REGIONS</span><span>ABLATION STUDY</span></div><div class="research-warning"><strong>Novelty is not assumed.</strong><span>The contribution must be established by verified prior work and experimental evidence.</span></div></article></section>
    <section class="card project-method-card"><div class="section-kicker">RESEARCH METHOD <span>/ 03</span></div><h2>From image pair to evidence</h2><div class="project-method-steps"><div><span>01 · DATA</span><strong>Choose benchmarks</strong><p>Match seasonal and building-change datasets to the research question.</p></div><div><span>02 · PREPARE</span><strong>Register & normalize</strong><p>Control image alignment, resolution, and acquisition differences.</p></div><div><span>03 · COMPARE</span><strong>Train & test models</strong><p>Compare baselines against the proposed approach on held-out data.</p></div><div><span>04 · REPORT</span><strong>Evaluate honestly</strong><p>Report F1, IoU, precision, recall, inference time, and ablations.</p></div></div></section>
    <div class="project-page-actions"><a class="primary-action" routerLink="/image-lab">Open visual comparison <span>→</span></a><a class="hero-secondary-cta" routerLink="/research">Review research notes <span>→</span></a><span>All results are pending experimental validation.</span></div>`
})
export class ProjectPage {
  readonly workspace = inject(WorkspaceService);
}
