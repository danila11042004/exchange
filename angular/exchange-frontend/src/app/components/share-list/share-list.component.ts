import { Component, OnInit } from '@angular/core';
import { ShareService, Share } from '../../services/share.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-share-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <h2>Список акций</h2>
    <div class="form-container" *ngIf="isAdmin">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <input formControlName="companyName" placeholder="Название компании" required />
        <input formControlName="companyAddress" placeholder="Адрес" />
        <input formControlName="price" placeholder="Цена" type="number" />
        <input formControlName="quantityAvailable" placeholder="Доступно" type="number" />
        <input formControlName="controlStakeSize" placeholder="Контрольный пакет (%)" type="number" />
        <button type="submit" [disabled]="form.invalid">
          {{ editingShare ? 'Сохранить' : 'Добавить' }}
        </button>
        <button type="button" *ngIf="editingShare" (click)="cancelEdit()">Отмена</button>
      </form>
    </div>

    <table>
      <thead>
        <tr>
          <th>Компания</th>
          <th>Адрес</th>
          <th>Цена</th>
          <th>Доступно</th>
          <th>Контр. пакет</th>
          <th *ngIf="isAdmin">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let share of shares">
          <td>{{ share.companyName }}</td>
          <td>{{ share.companyAddress }}</td>
          <td>{{ share.price | number:'1.2-2' }}</td>
          <td>{{ share.quantityAvailable }}</td>
          <td>{{ share.controlStakeSize }}%</td>
          <td *ngIf="isAdmin">
            <button (click)="startEdit(share)">✏️</button>
            <button (click)="deleteShare(share)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    .form-container {
      position: sticky;
      top: 0;
      background: white;
      padding: 10px 0;
      z-index: 1000;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    form {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    input {
      padding: 4px;
      flex: 1 1 180px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 8px;
      border: 1px solid #ddd;
    }
    th {
      background-color: #f2f2f2;
    }
  `]
})
export class ShareListComponent implements OnInit {
  shares: Share[] = [];
  form: FormGroup;
  editingShare: Share | null = null;
  isAdmin = false;

  constructor(private shareService: ShareService, private fb: FormBuilder) {
    this.form = this.fb.group({
      companyName: ['', Validators.required],
      companyAddress: [''],
      price: [0, Validators.min(0)],
      quantityAvailable: [0, Validators.min(0)],
      controlStakeSize: [0, [Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit() {
    this.isAdmin = this.checkIfUserIsAdmin();
    this.loadShares();
  }

  checkIfUserIsAdmin(): boolean {
    // TODO: Получить из сервиса авторизации
    return false;
  }

  loadShares() {
    this.shareService.getAll().subscribe(data => {
      this.shares = data.sort((a, b) => a.companyName.localeCompare(b.companyName));
    });
  }

  onSubmit() {
    if (!this.form.valid) return;

    if (this.editingShare) {
      const updated = { ...this.editingShare, ...this.form.value };
      this.shareService.update(this.editingShare.id, updated).subscribe(() => {
        this.loadShares();
        this.cancelEdit();
      });
    } else {
      this.shareService.create(this.form.value).subscribe(() => {
        this.loadShares();
        this.form.reset();
      });
    }
  }

  startEdit(share: Share) {
    this.editingShare = share;
    this.form.patchValue(share);
  }

  cancelEdit() {
    this.editingShare = null;
    this.form.reset();
  }

  deleteShare(share: Share) {
    if (confirm(`Удалить акцию компании "${share.companyName}"?`)) {
      this.shareService.delete(share.id).subscribe(() => this.loadShares());
    }
  }
}
