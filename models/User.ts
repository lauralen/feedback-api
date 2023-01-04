import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

UserSchema.pre('save', async function () {
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getSignedJwtToken = function () {
	const { JWT_SECRET, JWT_EXPIRE } = process.env

	if (JWT_SECRET && JWT_EXPIRE) {
		return jwt.sign({ id: this._id }, JWT_SECRET, {
			expiresIn: JWT_EXPIRE,
		})
	}
}

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
	return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model<UserType>('User', UserSchema)
