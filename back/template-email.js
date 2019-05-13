let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'releoapp@gmail.com',
        pass: 'Releoco55%&123'
    }
});

//text1 ==> es el primer parrafo antes del boton rojo
//boton ==> es el nombre de la imagen del boton rojo
//text2 ==> es el parrafo despues del boton rojo
//url1  ==> es la url a donde debe llevar cuando le da click en el boton rojo
const htmlTemplate=(titulo, text1, text2)=>{
    return `
        <h1>${titulo}</h1> 
        <p>${text1}</p>
        <p>${text2}</p>
    `
};

const mailOptions = (req, user, titulo, text1, text2, asunto)=>{
    let options = {
        from: '<releoapp@gmail.com>',         
        to: user.email,                       
        subject: asunto,                          
        html:  htmlTemplate(titulo, text1, text2)
    };
    transporter.sendMail(options, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });
}


module.exports = mailOptions
  
  
 