export function validateRut(rut: string, expirationDate: string): { valid: boolean; message?: string } {
  // Paso 1: Validar formato del RUT y dígito verificador
  const rutWithoutDv = rut.slice(0, -2).replace(/\./g, '');
  const dv = rut.slice(-1).toUpperCase();

  let total = 0;
  let factor = 2;

  for (let i = rutWithoutDv.length - 1; i >= 0; i--) {
    total += parseInt(rutWithoutDv[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }

  const expectedDv = 11 - (total % 11);
  const calculatedDv = expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : expectedDv.toString();

  if (dv !== calculatedDv) {
    return { valid: false, message: 'RUT no válido' };
  }

  // Paso 2: Validar que la fecha de expiración no haya pasado
  const expiration = new Date(expirationDate);
  const today = new Date();
  
  if (expiration < today) {
    return { valid: false, message: 'Cédula expirada' };
  }

  return { valid: true };
}

