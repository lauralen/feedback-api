import mongoose from 'mongoose'

const MAX_TITLE_LENGTH = 130
const MAX_DESCRIPTION_LENGTH = 130

const RequestSchema = new mongoose.Schema({
	title: {
		type: String,
		maxLength: [
			MAX_TITLE_LENGTH,
			`Title cannot be more than ${MAX_TITLE_LENGTH} characters`,
		],
		unique: true,
		trim: true,
		required: [true, 'Please add a title'],
	},
	category: {
		type: String,
		enum: ['enhancement', 'feature', 'bug', 'UI', 'UX'],
		default: 'enhancement',
		required: [true, 'Please add a category'],
	},
	upvotes: {
		type: Number,
		default: 0,
		minimum: [0, 'Upvotes cannot be less than 0'],
		required: [true, 'Please add upvotes'],
	},
	status: {
		type: String,
		enum: ['suggestion', 'planned', 'in-progress', 'live'],
		default: 'suggestion',
		required: [true, 'Please add a status'],
	},
	description: {
		type: String,
		required: [true, 'Please add a description'],
		trim: true,
		maxLength: [
			MAX_DESCRIPTION_LENGTH,
			`Description cannot be more than ${MAX_DESCRIPTION_LENGTH} characters`,
		],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	// comments: TODO,
})

export default mongoose.model('Request', RequestSchema)
