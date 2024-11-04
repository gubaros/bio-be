import { Router } from 'express';
import Identity from '../models/Identity';
import { sendToQueue } from '../utils/rabbitmq';

const router = Router();

// Endpoint para registrar identidad
router.post('/register', async (req: any, res: any) => {
  try {
    const { rut, serialNumber, expirationDate } = req.body;
    
    if (!rut ) {
      return res.status(400).json({ error: 'Falta el rut  ' });
    }
 
    if (!serialNumber) {
     return res.status(400).json({ error: 'Falta el serial number'});
    } 
   
    if (!expirationDate) {
     return res.status(400).json({ error: 'Falta el expiration code'});
    }

    const identity = new Identity({ rut, serialNumber, expirationDate });
    await identity.save();

    res.status(201).json({ message: 'Identidad registrada', identity });
  } catch (error) {
    console.error("Error registrando identidad:", error);
    res.status(500).json({ error: 'Error registrando identidad' });
  }
});

// Endpoint para validar el RUT y la fecha de expiración de la cédula
router.post('/validate-identity', async (req: any, res: any) => {
  const { rut, expirationDate } = req.body;

  if (!rut || !expirationDate) {
    return res.status(400).json({ error: 'RUT y fecha de expiración son requeridos' });
  }

  // Enviar la tarea a RabbitMQ para validación asíncrona
  const message = { rut, expirationDate };
  await sendToQueue('identity_validation', message);

  return res.status(200).json({ message: 'Validation request sent' });
});

export default router;

