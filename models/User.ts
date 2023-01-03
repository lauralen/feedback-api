import mongoose from 'mongoose'

const MIN_PASSWORD_LENGTH = 6

export type UserType = {
	name: string
}

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please add a name'],
	},
	email: {
		type: String,
		required: [true, 'Please add an email'],
		unique: true,
		match: [
			/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
			'Please add a valid email',
		],
	},
	role: {
		type: String,
		enum: ['user', 'publisher'],
		default: 'user',
	},
	password: {
		type: String,
		required: [true, 'Please add a password'],
		minLength: [
			MIN_PASSWORD_LENGTH,
			`PAssword must be at least ${MIN_PASSWORD_LENGTH} characters`,
		],
		select: false, // don't return password when fetching user
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now(),
	},
})

export default mongoose.model<UserType>('User', UserSchema)
