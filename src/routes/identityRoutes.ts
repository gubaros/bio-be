import { Router, Request, Response } from 'express';
import Identity from '../models/Identity';
import { validateRut } from '../utils/validateRut'; // Importa la función de validación consolidada

const router = Router();

// Endpoint para registrar identidad
router.post('/register', async (req: any, res: any) => { // Cambio a `any`
  try {
    const identity = new Identity(req.body);
    await identity.save();
    res.status(201).json(identity);
  } catch (error) {
    console.error("Error registrando identidad:", error);
    res.status(500).json({ error: 'Error registrando identidad' });
  }
});

// Endpoint para validar el RUT y la fecha de expiración de la cédula
router.post('/validate-identity', (req: any, res: any) => { // Cambio a `any`
  const { rut, expirationDate } = req.body;

  if (!rut || !expirationDate) {
    return res.status(400).json({ error: 'RUT y fecha de expiración son requeridos' });
  }

  const validation = validateRut(rut, expirationDate);

  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  return res.json({ valid: true });
});

// Endpoint para verificar identidad
router.post('/verify', async (req: any, res: any) => { // Cambio a `any`
  try {
    const { rut, serialNumber } = req.body;
    const identity = await Identity.findOne({ rut, serialNumber });
    if (!identity) {
      return res.status(404).json({ error: 'Identidad no encontrada' });
    }

    res.json({ valid: true, identity });
  } catch (error) {
    console.error("Error verificando identidad:", error);
    res.status(500).json({ error: 'Error verificando identidad' });
  }
});


export default router;
