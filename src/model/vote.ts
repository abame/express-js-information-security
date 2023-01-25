import { Schema, model, Document } from 'mongoose';

interface IVote extends Document {
    pollId: number,
    votes: number,
    ipAdresses: string[]
};

const voteSchema = new Schema<IVote>(
    {
        pollId: {
            type: Number,
        },
        votes: {
            type: Number
        },
        ipAdresses: [{
            type: String
        }]
    }
);

const Vote = model<IVote>('Votes', voteSchema);

export {
    Vote,
    IVote
}
