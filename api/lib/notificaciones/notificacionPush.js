const fetch = require('node-fetch');

// Función original para tokenPhone (compatibilidad)
const notificacionPush = (tokenPhone, title, body) => {
    console.log({tokenPhone, title, body});
    return fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAAYjYUWiw:APA91bH-AwDiTvxJ1rqX9jvdLux2MEo2TFGyXs60O0bPWQfZ7ZTx638k8rjCmAboZk4MQNXI5g-GZUT2e8N5kqpqqnnQb8eOoRGlHux-Zb1HhBbQWhCVr8bA7PV6ZVaWqr6zOr14Hhfz'
        },
        body: JSON.stringify({
            "to": tokenPhone,
            notification: {
                "title": title,
                "show_in_foreground": false,
                "body": body,
                "color": "#00ACD4",
                "priority": "high",
                "icon": "ic_notif",
                "group": "GROUP",
                "sound": "default",
                "id": "id",
            },
            "data": {
                group: "GROUP",
            }
        })
    })
    .then(res => res.json())
    .then(json => {
        console.log('Notificación tokenPhone enviada:', json);
        return json;
    })
    .catch(error => {
        console.error('Error enviando notificación tokenPhone:', error);
        throw error;
    });
};

// Nueva función para FCM token
const notificacionPushFCM = (fcmToken, title, body) => {
    console.log({fcmToken, title, body});
    return fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAAYjYUWiw:APA91bH-AwDiTvxJ1rqX9jvdLux2MEo2TFGyXs60O0bPWQfZ7ZTx638k8rjCmAboZk4MQNXI5g-GZUT2e8N5kqpqqnnQb8eOoRGlHux-Zb1HhBbQWhCVr8bA7PV6ZVaWqr6zOr14Hhfz'
        },
        body: JSON.stringify({
            "to": fcmToken,
            notification: {
                "title": title,
                "show_in_foreground": false,
                "body": body,
                "color": "#00ACD4",
                "priority": "high",
                "icon": "ic_notif",
                "group": "GROUP",
                "sound": "default",
                "id": "id",
            },
            "data": {
                group: "GROUP",
            }
        })
    })
    .then(res => res.json())
    .then(json => {
        console.log('Notificación FCM enviada:', json);
        return json;
    })
    .catch(error => {
        console.error('Error enviando notificación FCM:', error);
        throw error;
    });
};

module.exports = { notificacionPush, notificacionPushFCM };
