// src/consumers/identityValidator.ts
import amqplib from 'amqplib';
import { validateRut } from '@utils/validateRut';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672';
const RETRY_INTERVAL = 5000; // Intervalo de reintento en milisegundos

async function connectAndConsume() {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queueName = 'identity_validation';

    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages in ${queueName}`);

    channel.consume(queueName, async (msg) => {
      if (msg) {
        const { rut, expirationDate } = JSON.parse(msg.content.toString());
        const validation = validateRut(rut, expirationDate);

        if (validation.valid) {
          console.log(`Valid RUT: ${rut} with expiration: ${expirationDate}`);
        } else {
          console.log(`Invalid: ${validation.message}`);
        }

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error consuming messages:", error);
    console.log(`Retrying in ${RETRY_INTERVAL / 1000} seconds...`);
    setTimeout(connectAndConsume, RETRY_INTERVAL);
  }
}

connectAndConsume().catch((error) => {
  console.error("Fatal error in consumer:", error);
});

