const mongoose = require('mongoose')
const Post = require('../models/post')
const Vote = require('../models/vote')

module.exports = {
    voteToStatus: async(userVote, postVote) => {
        return await Vote.findOneAndDelete({ userVote, postVote })
            .exec()
            .then(async alreadyVoted => {
                return await Post.findOne({ _id: postVote })
                    .exec()
                    .then(async postFindResult => {
                        if (!alreadyVoted) {
                            await new Vote({
                                    _id: mongoose.Types.ObjectId(),
                                    userVote,
                                    postVote
                                })
                                .save()
                                .catch(err => {
                                    return JSON.stringify({ code: -4, message: "Failed to vote post", json: err })
                                })
                        }
                        return await Vote.find({ postVote })
                            .exec()
                            .then(async allVoteResult => {
                                postFindResult.meta.likes = allVoteResult.length
                                await postFindResult.save()
                                    .catch(err => JSON.stringify({ code: -6, message: "Failed to save number of like", json: err }))

                                var message = alreadyVoted ? "Successully unvote post" : "Successully vote post"
                                return JSON.stringify({ code: 0, message, json: alreadyVoted, data: { no_vote: allVoteResult.length } })
                            })
                            .catch(err => JSON.stringify({ code: -5, message: "Failed to find all vote", json: err }))
                    })
                    .catch(err => {
                        return JSON.stringify({ code: -5, message: "No post valid", json: err })
                    })
            })
            .catch(err => {
                return JSON.stringify({ code: -5, message: "Failed to vote/unvote post", json: err })
            })
    }
}