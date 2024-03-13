import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

interface ErrorValidate {
  [s: string]: boolean;
}


export class AuthFormUtils {

  authForm !: UntypedFormGroup;

  constructor() {
  }

  /** Inicializa formulario a analizar */
  public initFormGroup(form: UntypedFormGroup): void {
    this.authForm = form;
  }
  /* --------------------------------------- */

  /** Obtiene si el campo es valido y ya fue tocado */
  public fieldValidate(field: string): any{
    return this.authForm.get(field)?.invalid && this.authForm.get(field)?.touched;
  }
  /* --------------------------------------- */

  public comparePasswords(password1: string, password2: string ): any {
    const pass1 = this.authForm.get(password1)?.value || '';
    const pass2 = this.authForm.get(password2)?.value || ' ';

    return ((pass1 === pass2) ? false : true ) && this.authForm.get(password2)?.touched;
  }
  /* --------------------------------------- */

  /** Validador para passwords */
  validatorPasswords(pass1Name: string, pass2Name: string): any {
    return (formGroup: UntypedFormGroup) => {
      const pass1Control = formGroup.controls[pass1Name];
      const pass2Control = formGroup.controls[pass2Name];

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ notEqual: true });
      }
    };
  }
  /* --------------------------------------- */

  /** Validador para texto y campo */
  validatorTextAndField(text: string, field: string): any {
    return (formGroup: UntypedFormGroup) => {
      const fieldControl = formGroup.controls[field];

      if (fieldControl.value === text) {
        fieldControl.setErrors(null);
      } else {
        fieldControl.setErrors({ notEqual: true });
      }
    };
  }
  /* --------------------------------------- */



  /** Obtiene valor de un campo de formulario */
  public getFormValue(formControlName: string): any {
    return this.authForm.get(formControlName)?.value;
  }
  /* --------------------------------------- */

  /** Obtiene si el formulario es invalido */
  public get isFormValid(): boolean{
    return !this.authForm.invalid;
  }
  /* --------------------------------------- */

  /** Marca campos como tocados */
  public formMarkAsTouched(): void {
    Object.values(this.authForm.controls).forEach(control => {
      if (control instanceof UntypedFormGroup) {
        Object.values(control.controls).forEach((control2) => {
          return control2.markAsTouched();
        });
      } else { control.markAsTouched(); }
    });
  }
  /* --------------------------------------- */

  /**
   * Retorna en string el tipo de error del campo
   * @param field campo a detectar error
   * @returns string con mensaje de error
   */
  public getError( field: string): string | undefined{
    const errorForm = this.authForm.get(field)?.errors;

    if (errorForm?.required){return `Este campo es requerido`; }

    if (errorForm?.min){return `Valor minimo ${errorForm?.min.min}`; }

    if (errorForm?.max){return `Valor máximo ${errorForm?.max.max}`; }

    if (errorForm?.minlength){return `Debe contener al menos ${errorForm?.minlength.requiredLength} caracteres`; }

    if (errorForm?.maxlength){return `Debe contener máximo ${errorForm?.maxlength.requiredLength} caracteres`; }

    if (errorForm?.pattern){return `No se permiten los caracteres especiales`; }

    return undefined;
  }
  /* --------------------------------------- */

}
