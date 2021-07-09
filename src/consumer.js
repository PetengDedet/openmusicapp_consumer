require('dotenv').config();

const amqp = require('amqplib');
const PlaylistsService = require('./PlaylistsService');
const MailSender = require('./MailSender');
const Listener = require('./Listener');

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue(process.env.PLAYLIST_CHANNEL, {
    durable: true,
  });

  channel.consume(process.env.PLAYLIST_CHANNEL, listener.listen, {
    noAck: true,
  });

  console.log(`Listening RabbitMQ on ${process.env.RABBITMQ_SERVER} for channel: "${process.env.PLAYLIST_CHANNEL}"`);
};

init();
