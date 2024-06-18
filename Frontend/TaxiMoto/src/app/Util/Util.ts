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

 