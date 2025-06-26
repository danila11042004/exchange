import { Component, OnInit } from '@angular/core';
import { ShareService, Share } from '../../services/share.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-share-list',
  templateUrl: './share-list.component.html',
  styleUrls: ['./share-list.component.scss'],
  standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule] // вот тут подключаем
})
export class ShareListComponent implements OnInit {
  shares: Share[] = [];
  form: FormGroup;
  editingShare: Share | null = null;
  isAdmin = false;

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
    if (!this.filterValue.trim()) return this.shares;

    const value = this.filterValue.toLowerCase();
    return this.shares.filter(share => {
      const field = share[this.filterField];
      return field !== null && field !== undefined && field.toString().toLowerCase().includes(value);
    });
  }

  onKeyDownNoMinus(event: KeyboardEvent) {
    if (event.key === '-') event.preventDefault();
  }

  onNumberInput(controlName: string) {
    const value = this.form.controls[controlName].value;
    if (value !== null && value !== '' && (+value <= 0)) {
      this.form.controls[controlName].setValue('');
    }
  }

  onSubmit() {
    const { companyName, companyAddress, price, quantityAvailable, controlStakeSize } = this.form.value;

    if (!companyName?.trim()) {
      alert('Поле "Название компании" обязательно и не может содержать только пробелы');
      return;
    }

    if (companyAddress !== null && companyAddress !== '' && companyAddress.trim().length === 0) {
      alert('Поле "Адрес компании" не может содержать только пробелы');
      return;
    }

    if (!price || +price <= 0) {
      alert('Поле "Цена" обязательно и должно быть больше 0');
      return;
    }

    if (!quantityAvailable || +quantityAvailable <= 0) {
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
