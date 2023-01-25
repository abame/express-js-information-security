import { Document, ObjectId } from "mongoose";
import { IVote, Vote } from "../model/vote.js";

const createVote = (pollId: number): IVote => {
    return new Vote({
        pollId: pollId,
        ipAdresses: [],
        votes: 0
    });
}

const save = async (schema: Document) => {
    return schema.save(function (err: any) {
        if (err)
            return console.log(err);
    });
}

const deleteAllVotes = async () => {
    return await Vote.deleteMany();
}

const findVote = async (pollId: number): Promise<IVote & { _id: ObjectId; } | null> => {
    return await Vote.findOne({ pollId }).exec();
}

export { createVote, save, findVote, deleteAllVotes }
