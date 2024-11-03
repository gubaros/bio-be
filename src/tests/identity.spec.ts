import request from 'supertest';
import { expect } from 'chai';
import app from '../app'; // Asegúrate de que `app` sea exportable desde `src/app.ts`

describe('Identity Endpoints', () => {
  // Prueba para el registro de identidad
  describe('POST /api/identity/register', () => {
    it('Debería registrar una nueva identidad', async () => {
      const res = await request(app)
        .post('/api/identity/register')
        .send({
          rut: "12345678-9",
          serialNumber: "ABC123456",
          expirationDate: "2025-12-31"
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('_id');
      expect(res.body.rut).to.equal("12345678-9");
    });

    it('Debería fallar cuando faltan datos', async () => {
      const res = await request(app)
        .post('/api/identity/register')
        .send({
          rut: "12345678-9"
        });

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('error');
    });
  });

  // Prueba para verificar la identidad
  describe('POST /api/identity/verify', () => {
    it('Debería verificar una identidad existente', async () => {
      const res = await request(app)
        .post('/api/identity/verify')
        .send({
          rut: "12345678-9",
          serialNumber: "ABC123456"
        });

      expect(res.status).to.equal(200);
      expect(res.body.valid).to.be.true;
    });

    it('Debería devolver un error si la identidad no existe', async () => {
      const res = await request(app)
        .post('/api/identity/verify')
        .send({
          rut: "00000000-0",
          serialNumber: "INVALID123"
        });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error', 'Identidad no encontrada');
    });
  });

  // Prueba para validar el RUT
  describe('POST /api/identity/validate-rut', () => {
    it('Debería validar un RUT correcto', async () => {
      const res = await request(app)
        .post('/api/identity/validate-rut')
        .send({ rut: "12345678-9" });

      expect(res.status).to.equal(200);
      expect(res.body.validRut).to.be.true;
    });

    it('Debería devolver un error para un RUT incorrecto', async () => {
      const res = await request(app)
        .post('/api/identity/validate-rut')
        .send({ rut: "00000000-0" });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'RUT no válido');
    });
  });

  // Prueba para la expiración de la cédula
  describe('POST /api/identity/check-expiration', () => {
    it('Debería verificar que la cédula no está expirada', async () => {
      const res = await request(app)
        .post('/api/identity/check-expiration')
        .send({
          rut: "12345678-9",
          serialNumber: "ABC123456"
        });

      expect(res.status).to.equal(200);
      expect(res.body.expired).to.be.false;
    });

    it('Debería devolver un error si la identidad no se encuentra', async () => {
      const res = await request(app)
        .post('/api/identity/check-expiration')
        .send({
          rut: "00000000-0",
          serialNumber: "INVALID123"
        });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error', 'Identidad no encontrada');
    });
  });
});

