import { computed, Injectable, signal } from '@angular/core';

type HistoryItem = { title: string; detail: string; type: string; createdAt: string };
type UserProfile = { name: string; email: string; researchFocus: string };

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  readonly sampleBefore = 'https://images.pexels.com/photos/12534229/pexels-photo-12534229.jpeg?auto=compress&cs=tinysrgb&w=1800';
  readonly sampleAfter = 'https://images.pexels.com/photos/12464230/pexels-photo-12464230.jpeg?auto=compress&cs=tinysrgb&w=1800';
  readonly beforeImage = signal(this.sampleBefore);
  readonly afterImage = signal(this.sampleAfter);
  readonly beforeName = signal('Sample image A');
  readonly afterName = signal('Sample image B');
  readonly hasUploads = signal(false);
  readonly beforeUploaded = signal(false);
  readonly afterUploaded = signal(false);
  readonly pairReady = computed(() => this.beforeUploaded() && this.afterUploaded());
  readonly answer = signal('');
  readonly questions = signal<{ question: string; answer: string }[]>([]);
  readonly processing = signal<'idle' | 'reading' | 'ready'>('idle');
  readonly progress = signal(0);
  readonly profile = signal<UserProfile>({ name: 'Researcher', email: '', researchFocus: 'Remote sensing and change detection' });
  readonly history = signal<HistoryItem[]>([]);
  readonly projectSelected = signal(false);
  region = 'Sample area';
  imageADate = '2020-06-15';
  imageBDate = '2024-06-15';
  dataset = 'Demonstration sample';
  model = 'Not connected';
  notes = 'Illustrative imagery only. No model inference has been performed.';

  constructor() {
    if (typeof localStorage === 'undefined') return;
    const profile = localStorage.getItem('terrascope.profile');
    const history = localStorage.getItem('terrascope.history');
    this.projectSelected.set(localStorage.getItem('drisvia.project-selected') === 'true');
    if (profile) this.profile.set({ ...this.profile(), ...JSON.parse(profile) });
    if (history) this.history.set(JSON.parse(history));
  }

  saveProfile() {
    localStorage.setItem('terrascope.profile', JSON.stringify(this.profile()));
  }

  toggleProjectSelection() {
    const selected = !this.projectSelected();
    this.projectSelected.set(selected);
    localStorage.setItem('drisvia.project-selected', String(selected));
    if (selected) this.addHistory('Project selected', 'AI-based multi-temporal satellite change detection', 'project');
  }

  upload(event: Event, side: 'before' | 'after') {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    this.processing.set('reading');
    this.progress.set(0);
    const reader = new FileReader();
    reader.onprogress = progress => {
      if (progress.lengthComputable) this.progress.set(Math.round(progress.loaded / progress.total * 100));
    };
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        this.processing.set('idle');
        return;
      }
      if (side === 'before') {
        this.beforeImage.set(reader.result);
        this.beforeName.set(file.name);
        this.beforeUploaded.set(true);
      } else {
        this.afterImage.set(reader.result);
        this.afterName.set(file.name);
        this.afterUploaded.set(true);
      }
      this.hasUploads.set(true);
      this.progress.set(100);
      this.processing.set('ready');
      this.addHistory('Image added', `${side === 'before' ? 'Previous image' : 'New image'} · ${file.name}`, 'image');
    };
    reader.onerror = () => this.processing.set('idle');
    reader.readAsDataURL(file);
  }

  resetSample() {
    this.beforeImage.set(this.sampleBefore);
    this.afterImage.set(this.sampleAfter);
    this.beforeName.set('Sample image A');
    this.afterName.set('Sample image B');
    this.hasUploads.set(false);
    this.beforeUploaded.set(false);
    this.afterUploaded.set(false);
    this.processing.set('idle');
    this.progress.set(0);
  }

  mapsUrl() {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.region || 'Earth')}`;
  }

  ask(question: string) {
    const normalized = question.trim().toLowerCase();
    if (!normalized) return;
    let answer = 'This workspace currently contains sample imagery and research notes, not trained-model output. Add a validated change-detection backend to analyze your uploaded image pair.';
    if (/season|seasonal|vegetation/.test(normalized)) {
      answer = 'Seasonal vegetation and illumination can look like land-cover change. Compare images captured in similar seasons, check image registration, and evaluate false positives across seasonal pairs before interpreting changes.';
    } else if (/metric|f1|iou|precision|recall|accuracy/.test(normalized)) {
      answer = 'For a labeled test set, report precision, recall, F1 and intersection over union (IoU) alongside pixel accuracy. No scores are available in this demo because no predictions or ground-truth masks have been evaluated.';
    } else if (/dataset|levir|whu|s2looking|oscd|cdd/.test(normalized)) {
      answer = 'LEVIR-CD and WHU-CD focus on building changes; S2Looking covers varied viewing conditions; CDD includes seasonal change; OSCD uses multispectral Sentinel-2 imagery. Match the dataset to your research question and verify its license and annotations.';
    } else if (/model|siamese|unet|u-net|transformer|architecture/.test(normalized)) {
      answer = 'Siamese CNNs and U-Net-style decoders are useful baselines for bi-temporal segmentation. A research contribution needs a defined gap, a reproducible method, baseline comparisons, ablations and evaluation on held-out regions or seasons.';
    } else if (/map|location|region|google/.test(normalized)) {
      answer = `The current study region is “${this.region}”. Open the location in Google Maps from the workspace. A Google Maps API key is not configured, so map access opens the public Maps search instead of an embedded API map.`;
    }
    this.answer.set(answer);
    this.questions.update(items => [{ question: question.trim(), answer }, ...items].slice(0, 5));
    this.addHistory('Research question', question.trim(), 'question');
  }

  addHistory(title: string, detail: string, type: string) {
    const item = { title, detail, type, createdAt: new Date().toISOString() };
    this.history.update(items => [item, ...items].slice(0, 30));
    localStorage.setItem('terrascope.history', JSON.stringify(this.history()));
  }

  clearHistory() {
    this.history.set([]);
    localStorage.removeItem('terrascope.history');
  }

  exportSummary() {
    const report = `DRISVIA — STUDY SUMMARY\n\nStudy: ${this.region}\nImage A: ${this.beforeName()} (${this.imageADate})\nImage B: ${this.afterName()} (${this.imageBDate})\nDataset: ${this.dataset}\nModel: ${this.model}\n\nNotes: ${this.notes}\n\nStatus: Demonstration only. No AI inference has been performed. All sample charts are illustrative, not measured results.\n`;
    const url = URL.createObjectURL(new Blob([report], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'drisvia-study-summary.txt';
    link.click();
    URL.revokeObjectURL(url);
  }
}
