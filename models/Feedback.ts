import mongoose from 'mongoose'

const MAX_TITLE_LENGTH = 130
const MAX_DESCRIPTION_LENGTH = 130

export type FeedbackType = {
	title: string
	category: string
	upvotes: number
	status: string
	description: string
	createdAt: string
}

const FeedbackSchema = new mongoose.Schema(
	{
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
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

// delete comments when feedback is deleted
FeedbackSchema.pre('remove', async function (next) {
	// TODO: fix TS errors
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	await this.model('Comment').deleteMany({ feedback: this._id })
	next()
})

// reverse populate with virtuals
FeedbackSchema.virtual('comments', {
	ref: 'Comment',
	localField: '_id',
	foreignField: 'feedback',
	justOne: false,
})

export default mongoose.model<FeedbackType>('Feedback', FeedbackSchema)
