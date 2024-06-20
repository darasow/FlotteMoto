import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function extractErrorMessages(errorResponse: any): string[] {
    let errors: string[] = [];
  
    if (errorResponse.error && typeof errorResponse.error === 'object') {
      for (let key in errorResponse.error) {
        if (errorResponse.error.hasOwnProperty(key)) {
          const errorArray = errorResponse.error[key];
          if (Array.isArray(errorArray)) {
            errorArray.forEach((err: string) => {
              errors.push(`${key}: ${err}`);
            });
          } else {
            errors.push(`${key}: ${errorResponse.error[key]}`);
          }
        }
      }
    } else if (errorResponse.message) {
      errors.push(errorResponse.message);
    } else {
      errors.push('Une erreur inattendue est survenue.');
    }
  
    return errors;
  }


  export function dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const date_debut = control.get('date_debut')?.value;
      const date_fin = control.get('date_fin')?.value;
  
      if (date_debut && date_fin && new Date(date_debut) >= new Date(date_fin)) {
        return { dateRangeInvalid: true };
      }
      return null;
    };
  }
  
 