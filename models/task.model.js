const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    title:{
        type:String,
        required: [true, 'Please provide a title for the task'],
        trim:true
    },
    description:{
        type:String,
        required: [true, 'Please provide a description for the task'],
        trim:true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
        required: true
    }
}, {timestamps:true}) /**this will automatically adds created_at and updated_at */

module.exports = mongoose.model('Task', TaskSchema)