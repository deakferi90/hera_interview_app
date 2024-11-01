import { Component, OnInit } from '@angular/core';
import { Beneficiar } from './beneficiar.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-beneficiari',
  standalone: true,
  templateUrl: './beneficiari.component.html',
  styleUrls: ['./beneficiari.component.scss'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
})
export class BeneficiariComponent implements OnInit {
  beneficiari: Beneficiar[] = [];
  persoane: any[] | undefined;
  newBeneficiar: Beneficiar = this.initializeNewBeneficiar();
  isEditing: boolean = false;
  isSubmitted = false;
  currentBeneficiarId: number | null = null;
  filteredBeneficiari: Beneficiar[] = [];
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  showForm = false;

  ngOnInit(): void {
    this.loadBeneficiari();
    this.persoane = [
      { id: 1, name: 'Persoană Fizică', value: 'persoana_fizica' },
      { id: 2, name: 'Persoană Juridică', value: 'persoana_juridica' },
    ];
    this.filteredBeneficiari = [...this.beneficiari];
  }

  initializeNewBeneficiar(): Beneficiar {
    return {
      tip: 'persoana_fizica',
      nume: '',
      prenume: '',
      adresa: '',
      cnp: '',
      dataInfiintarii: '',
      dataNasterii: '',
      telefon: '',
      conturiIBAN: '',
    };
  }

  filterBeneficiari(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    const filterValue = target.value.toLowerCase();

    this.filteredBeneficiari = this.beneficiari.filter((beneficiar) => {
      const numeMatch =
        beneficiar.nume?.toLowerCase().includes(filterValue) || false;
      const prenumeMatch =
        beneficiar.prenume?.toLowerCase().includes(filterValue) || false;
      const denumire =
        beneficiar.denumire?.toLowerCase().includes(filterValue) || false;
      const tipMatch =
        beneficiar.tip?.toLowerCase().includes(filterValue) || false;
      return numeMatch || prenumeMatch || denumire || tipMatch;
    });
  }

  loadBeneficiari() {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('beneficiari');
      this.beneficiari = data ? JSON.parse(data) : [];
      this.filteredBeneficiari = [...this.beneficiari];
    }
  }

  saveBeneficiar() {
    this.isSubmitted = true;
    if (this.validateBeneficiar(this.newBeneficiar)) {
      if (this.isEditing && this.currentBeneficiarId !== null) {
        this.updateBeneficiarInList();
      } else {
        this.newBeneficiar.id = Date.now();
        this.beneficiari.push({ ...this.newBeneficiar });
      }
      localStorage.setItem('beneficiari', JSON.stringify(this.beneficiari));
      this.updateFilteredList();
      this.resetForm();
    }
  }

  updateBeneficiar(beneficiar: Beneficiar) {
    this.newBeneficiar = { ...beneficiar };
    this.isEditing = true;
    this.currentBeneficiarId = beneficiar.id!;
  }

  updateBeneficiarInList() {
    const index = this.beneficiari.findIndex(
      (b) => b.id === this.currentBeneficiarId
    );
    if (index !== -1) {
      this.beneficiari[index] = { ...this.newBeneficiar };
    }
    this.updateFilteredList();
    this.isEditing = false;
    this.currentBeneficiarId = null;
  }

  deleteBeneficiar(id: number) {
    this.beneficiari = this.beneficiari.filter((b) => b.id !== id);
    localStorage.setItem('beneficiari', JSON.stringify(this.beneficiari));
    this.updateFilteredList();
  }

  validateBeneficiar(beneficiar: Beneficiar): boolean {
    const mandatoryFields: (keyof Beneficiar)[] =
      beneficiar.tip === 'persoana_juridica'
        ? ['cui', 'conturiIBAN']
        : ['cnp', 'conturiIBAN'];

    return (
      mandatoryFields.every((field) => {
        const value = beneficiar[field];
        return (
          typeof value === 'string' && value.length > 0 && value.length <= 100
        );
      }) &&
      beneficiar.adresa.length <= 100 &&
      beneficiar.telefon.length <= 100 &&
      beneficiar.conturiIBAN.length <= 100
    );
  }

  resetForm() {
    this.newBeneficiar = this.initializeNewBeneficiar();
    this.isEditing = false;
    this.currentBeneficiarId = null;
    this.updateFilteredList();
  }

  updateFilteredList() {
    this.filteredBeneficiari = [...this.beneficiari];
  }

  sortTable(column: keyof Beneficiar) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortDirection = 'asc';
    }
    this.sortColumn = column;

    this.filteredBeneficiari.sort((a, b) => {
      const valueA = a[column] || '';
      const valueB = b[column] || '';

      const comparison = valueA
        .toString()
        .localeCompare(valueB.toString(), undefined, {
          numeric: true,
        });

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  addForm() {
    this.showForm = !this.showForm;
    let val = document.querySelector('.needs-validation ');
    val?.classList.toggle('hidden');
  }
}
