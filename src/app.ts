import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import identityRoutes from './routes/identityRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Configuración de rutas
app.use('/api/identity', identityRoutes);

// Función para verificar la conexión a MongoDB
async function verifyMongoConnection() {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection is not open");
    }

    const admin = mongoose.connection.db?.admin();
    const result = await admin?.ping();
    if (result?.ok === 1) {
      console.log("MongoDB connection successful:", result);
    } else {
      throw new Error("MongoDB ping failed");
    }
  } catch (error) {
    console.error("Failed to ping MongoDB:", error);
    process.exit(1);
  }
}

// Conectar a MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://root:example@mongo:27017/';
mongoose.connect(mongoUri)
  .then(async () => {
    console.log("Connected to MongoDB");
    await verifyMongoConnection();
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    }
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB", err);
  });

export default app;

