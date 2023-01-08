import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const MIN_PASSWORD_LENGTH = 6

export type UserType = {
	id: string
	name: string
	email: string
	role: 'user' | 'publisher'
	password: string
	resetPasswordToken: string
	resetPasswordExpire: string
	createdAt: string
	getSignedJwtToken: () => string | undefined
	matchPassword: (password: string) => Promise<boolean>
}

const UserSchema: Schema = new mongoose.Schema({
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

UserSchema.methods.getSignedJwtToken = function (): string | undefined {
	const { JWT_SECRET, JWT_EXPIRE } = process.env

	if (JWT_SECRET && JWT_EXPIRE) {
		return jwt.sign({ id: this._id }, JWT_SECRET, {
			expiresIn: JWT_EXPIRE,
		})
	}
}

UserSchema.methods.matchPassword = async function (
	enteredPassword: string
): Promise<boolean> {
	return await bcrypt.compare(enteredPassword, this.password)
}

export type UserModelType = UserType & Document
export default mongoose.model<UserModelType>('User', UserSchema)
