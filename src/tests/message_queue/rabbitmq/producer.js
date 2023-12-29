const amqp = require('amqplib')
const message = 'hello, RabbitMQ'

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()
        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        //Send message to consumer channel
        channel.sendToQueue(queueName, Buffer.from(message))
        console.log(`Message sent:`, message);
        setTimeout(() => {
            connection.close()
            process.exit(0);
        }, 500)
    } catch (error) {
        console.error(error);
    }
}

runProducer().then(result => console.log(result)).catch(console.error)