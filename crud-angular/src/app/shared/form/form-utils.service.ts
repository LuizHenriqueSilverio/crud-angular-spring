import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {

  constructor() { }

  validateAllFormFields(formGroup: UntypedFormGroup | UntypedFormArray): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if(control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      }else if(control instanceof UntypedFormGroup || control instanceof UntypedFormArray) {
        control.markAsTouched({ onlySelf: true });
        this.validateAllFormFields(control);
      }
    });
  }

  getErrorMessage(formGroup: UntypedFormGroup, fieldName: string): string {
    const field = formGroup.get(fieldName) as UntypedFormControl;
    return this.getErrorMessageFromField(field);
  }

  getFormArrayFieldErrorMessage(
    formGroup: UntypedFormGroup,
    formArrayName: string,
    fieldName: string,
    index: number): string {
    const formArray = formGroup.get(formArrayName) as UntypedFormArray;
    const field = formArray.controls[index].get(fieldName) as UntypedFormControl;
    return this.getErrorMessageFromField(field);
  }

  getErrorMessageFromField(field: UntypedFormControl): string {
    if(field?.hasError('required')) {
      return 'Campo obrigatório.';
    }
    if(field?.hasError('minlength')) {
      const requiredLength: number = field.errors ? field.errors['minlength']['requiredLength'] : 5;
      return `Mínimo de ${requiredLength} caracteres.`;
    }
    if(field?.hasError('maxlength')) {
      const requiredLength: number = field.errors ? field.errors['maxlength']['requiredLength'] : 100;
      return `Máximo de ${requiredLength} caracteres excedido.`;
    }
    return 'Campo inválido.';
  }

  isFormArrayRequired(formGroup: UntypedFormGroup, formArrayName: string): boolean {
    const formArray = formGroup.get(formArrayName) as UntypedFormArray;
    return !formArray.valid && formArray.hasError('required') && formArray.touched;
  }
}
