// src/models/Identity.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IIdentity extends Document {
  rut: string;
  serialNumber: string;
  expirationDate: Date;
}

const IdentitySchema: Schema = new Schema({
  rut: { type: String, required: true },
  serialNumber: { type: String, required: true },
  expirationDate: { type: Date, required: true },
});

export default mongoose.model<IIdentity>('Identity', IdentitySchema);

