import nodemailer from 'nodemailer'

const sendEmail = async (options: {
	email: string
	subject: string
	message: string
}) => {
	if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) return
	const host = process.env.SMTP_HOST as string
	const port = process.env.SMTP_PORT as string
	const user = process.env.SMTP_EMAIL as string
	const pass = process.env.SMTP_PASSWORD as string

	const transporter = nodemailer.createTransport({
		host,
		port: Number(port),
		auth: {
			user,
			pass,
		},
	})

	const message = {
		from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
		to: options.email,
		subject: options.subject,
		text: options.message,
	}

	const info = await transporter.sendMail(message)

	console.log('Message sent: %s', info.messageId)
}

export default sendEmail
