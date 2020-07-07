const { mailerInfo } = require('../utils/globalVariables.js');
const nodemailer = require('nodemailer');

class SuporteService {


	static contactSuporteByWhatsApp(message){
		let formatedMessage = message.replace(/\s/g, '%20')
  		let link = `https://api.whatsapp.com/send?phone=5582993947181&text=${formatedMessage}`;

  		/*
  		* Teste de submissao 
  		*/
  		//axios.post()

	}

	static async contactSuporteByEmail(name, email, message){
		
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				auth: mailerInfo.USER,
				pass: mailerInfo.PASS
			}
		});

		let emailMessage = "<html>";
		emailMessage += '<body>';
		emailMessage += '	<div>';
		emailMessage += `Name: ${name}`;
		emailMessage += '</div>';
		emailMessage += '<div>';
		emailMessage += `Email: ${email}`;
		emailMessage += '</div>';
		emailMessage += '<div>';
		emailMessage += `Message: ${message}`;
		emailMessage += '</div>'
		emailMessage += '</body>';
		emailMessage += '</html>';

		let emailOptions = {
			from: email,
			to: mailerInfo.USER,
			subject: 'Contact the suport.',
			html: emailMessage
		}

		let result = null;

		result = await transporter.sendMail(emailOptions)
		/*, function(error, info){
			if(error){
				//return Promise.reject()
				result = {message: 'Error to contact the suport'};
			}
			result = {message: 'Email successfully sent.'};
			//return Promise.resolve()
		})*/
		console.log(result);
		return result;

	}

}

module.exports =  SuporteService;