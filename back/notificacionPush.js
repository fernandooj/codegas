const fetch = require('node-fetch'); 
const notificacionPush = (tokenPhone, title, body)=>{
    console.log({tokenPhone, title, body})
    fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAAYjYUWiw:APA91bH-AwDiTvxJ1rqX9jvdLux2MEo2TFGyXs60O0bPWQfZ7ZTx638k8rjCmAboZk4MQNXI5g-GZUT2e8N5kqpqqnnQb8eOoRGlHux-Zb1HhBbQWhCVr8bA7PV6ZVaWqr6zOr14Hhfz'
        },
        body: JSON.stringify({
            "to":tokenPhone,
            notification:{
                "title": title,
                "show_in_foreground": false,
                "body": body,
                "color":"#00ACD4",
                "priority":"high",
                "icon":"ic_notif",
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
    .then(json => console.log(json));
}

module.exports = notificacionPush
  
  
 