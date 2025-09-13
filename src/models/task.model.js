const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the task'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description for the task'],
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
        required: true
    },
    dateStarted: {
        type: Date,
        default: Date.now // automatically set when task is created
    },
    deadline: {
        type: Date,
        required: [true, 'Please provide a deadline for the task']
    }
}, { timestamps: true }) // adds createdAt & updatedAt

module.exports = mongoose.model('Task', TaskSchema)
