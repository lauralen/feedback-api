import mongoose, { Document, Schema } from 'mongoose'

const MAX_COMMENT_LENGTH = 250

type CommentType = {
	content: string
	replies: CommentType[]
	feedback: string
}

const content = {
	type: String,
	maxLength: [
		MAX_COMMENT_LENGTH,
		`Comment cannot be more than ${MAX_COMMENT_LENGTH} characters`,
	],
	required: [true, 'Please add content'],
}

const CommentSchema: Schema = new mongoose.Schema({
	content,
	replies: {
		type: [
			{
				content,
				replyingTo: {
					type: String,
					required: [true, 'Please add replyingTo'],
				},
				// TODO: add user
			},
		],
	},
	feedback: {
		type: mongoose.Types.ObjectId,
		ref: 'Feedback',
		required: true,
	},
	// TODO: add user
})

export type CommentModelType = CommentType & Document
export default mongoose.model<CommentModelType>('Comment', CommentSchema)
