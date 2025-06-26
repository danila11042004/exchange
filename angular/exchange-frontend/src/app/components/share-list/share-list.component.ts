import { Component, OnInit } from '@angular/core';
import { ShareService, Share } from '../../services/share.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-share-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <h2>Список акций</h2>

    <div style="margin-bottom: 10px;">
      <label>Поиск по:
        <select [(ngModel)]="filterField">
          <option value="companyName">Название компании</option>
          <option value="companyAddress">Адрес</option>
          <option value="price">Цена</option>
          <option value="quantityAvailable">Доступно</option>
          <option value="controlStakeSize">Контр. пакет</option>
        </select>
      </label>
      <input [(ngModel)]="filterValue" placeholder="Введите значение для поиска" />
    </div>

    <div class="form-container" *ngIf="isAdmin">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <input formControlName="companyName" placeholder="Название компании" required />
        <input formControlName="companyAddress" placeholder="Адрес" />

        <input
          formControlName="price"
          placeholder="Цена (больше 0)"
          type="number"
          min="1"
          (input)="onNumberInput('price')"
          (keydown)="onKeyDownNoMinus($event)" />

        <input
          formControlName="quantityAvailable"
          placeholder="Доступно (больше 0)"
          type="number"
          min="1"
          (input)="onNumberInput('quantityAvailable')"
          (keydown)="onKeyDownNoMinus($event)" />

        <input
          formControlName="controlStakeSize"
          placeholder="Контрольный пакет (%)"
          type="number"
          min="1"
          max="100"
          (input)="onNumberInput('controlStakeSize')"
          (keydown)="onKeyDownNoMinus($event)" />

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
        <tr *ngFor="let share of filteredShares()">
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
    input, select {
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

  // поля фильтра
  filterField: keyof Share = 'companyName';
  filterValue: string = '';

  constructor(
    private shareService: ShareService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      companyName: ['', Validators.required],
      companyAddress: [''],
      price: ['', [Validators.required, Validators.min(1)]],
      quantityAvailable: ['', [Validators.required, Validators.min(1)]],
      controlStakeSize: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  ngOnInit() {
    this.authService.isAdmin$.subscribe(status => this.isAdmin = status);
    this.loadShares();
  }

  loadShares() {
    this.shareService.getAll().subscribe(data => {
      this.shares = data.sort((a, b) => a.companyName.localeCompare(b.companyName));
    });
  }

  filteredShares(): Share[] {
    if (!this.filterValue.trim()) {
      return this.shares;
    }

    const value = this.filterValue.toLowerCase();

    return this.shares.filter(share => {
      const field = share[this.filterField];
      return field !== null && field !== undefined && field.toString().toLowerCase().includes(value);
    });
  }

  onKeyDownNoMinus(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }

  onNumberInput(controlName: string) {
    let value = this.form.controls[controlName].value;

    if (value !== null && value !== '' && (+value <= 0)) {
      this.form.controls[controlName].setValue('');
    }
  }

  onSubmit() {
    const companyName = this.form.controls['companyName'].value;
    const price = this.form.controls['price'].value;
    const quantityAvailable = this.form.controls['quantityAvailable'].value;
    const controlStakeSize = this.form.controls['controlStakeSize'].value;
    const companyAddress = this.form.controls['companyAddress'].value;

    if (!companyName || companyName.trim().length === 0) {
      alert('Поле "Название компании" обязательно и не может содержать только пробелы');
      return;
    }

    if (companyAddress !== null && companyAddress !== '' && companyAddress.trim().length === 0) {
      alert('Поле "Адрес компании" не может содержать только пробелы');
      return;
    }

    if (price === null || price === '' || +price <= 0) {
      alert('Поле "Цена" обязательно и должно быть больше 0');
      return;
    }

    if (quantityAvailable === null || quantityAvailable === '' || +quantityAvailable <= 0) {
      alert('Поле "Доступно" обязательно и должно быть больше 0');
      return;
    }

    if (controlStakeSize !== null && controlStakeSize !== '') {
      if (+controlStakeSize < 0 || +controlStakeSize > 100) {
        alert('Поле "Контрольный пакет" должно быть от 0 до 100');
        return;
      }
    }

    if (this.form.invalid) return;

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
