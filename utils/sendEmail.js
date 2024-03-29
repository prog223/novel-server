import mail from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars'
import { __dirname } from '../index.js';

dotenv.config();

const validateEmail = function (email) {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};

const replaceHTML = function (html, obj) {
	return html.replace(/\{\{(.*?)\}\}/g, function (key) {
		const newData = obj[key.replace(/[{}]+/g, '')];
		return newData || '';
	});
};

const renderVerificationEmail = async (link, templateName) => {
	try {
	  const templatePath = path.join(__dirname, 'templates', templateName);
	  const template = fs.readFileSync(templatePath, 'utf8');
 
	  const compiledTemplate = handlebars.compile(template);

	  const html = compiledTemplate({ link });
	  return html;
	} catch (err) {
	  console.error('Error rendering email template:', err);
	  throw err;
	}
 };

const sendEmail = async (to, link, template) => {
	const html = await renderVerificationEmail(link, template)

	let transporter = mail.createTransport({
		host: process.env.contactHost,
		port: 465,
		maxMessages: Infinity,
		debug: true,
		secure: true,
		auth: {
			user: process.env.contactEmail,
			pass: process.env.contactPassword,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	transporter.sendMail(
		{
			from: `${process.env.contactEmail} <${process.env.contactEmail}>`,
			to: to,
			replyTo: process.env.contactEmail,
			headers: {
				'Mime-Version': '1.0',
				'X-Priority': '3',
				'Content-type': 'text/html; charset=iso-8859-1',
			},
			html,
		},
		(err, info) => {
			if (err !== null) {
				console.log(err);
			} else {
				console.log(`Email sent to ${to} at ${new Date().toISOString()}`);
			}
		}
	);
};

export { validateEmail, replaceHTML, sendEmail };
