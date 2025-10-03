const { main } = require('./src/notificar-pedidos-3-dias');

// Simular evento y contexto de Lambda
const event = {
    source: 'aws.events',
    'detail-type': 'Scheduled Event',
    detail: {}
};

const context = {
    functionName: 'notificarPedidos3Dias',
    functionVersion: '$LATEST',
    invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:notificarPedidos3Dias',
    memoryLimitInMB: '256',
    awsRequestId: 'test-request-id',
    logGroupName: '/aws/lambda/notificarPedidos3Dias',
    logStreamName: '2023/01/01/[$LATEST]test-stream',
    getRemainingTimeInMillis: () => 30000
};

// Ejecutar la función
async function testFunction() {
    console.log('🧪 Iniciando prueba de la función de notificaciones...\n');

    try {
        const result = await main(event, context);

        console.log('\n✅ Resultado de la prueba:');
        console.log('Status Code:', result.statusCode);

        console.log('Body:', JSON.stringify(JSON.parse(result.body), null, 2));

        if (result.statusCode === 200) {
            console.log('\n🎉 ¡Prueba exitosa!');
        } else {
            console.log('\n❌ La función retornó un error');
        }

    } catch (error) {
        console.error('\n💥 Error durante la prueba:', error);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    testFunction();
}

module.exports = { testFunction };
