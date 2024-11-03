import mongoose from 'mongoose';

const IdentitySchema = new mongoose.Schema({
  rut: { type: String, required: true },
  serialNumber: { type: String, required: true },
  expirationDate: { type: Date, required: true },
});

export default mongoose.model('Identity', IdentitySchema);

