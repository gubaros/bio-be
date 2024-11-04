// src/utils/rabbitmq.ts
import amqplib from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

export async function sendToQueue(queueName: string, message: any) {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    console.log(`Message sent to queue ${queueName}`);
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error sending message to queue:', error);
  }
}

