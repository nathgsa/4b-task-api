const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    title:{
        type:String,
        required: [true, 'Please provide a title for the task'],
        trim:true
    },
    description:{
        type:String,
        required: [true, 'Please provide a title for the task'],
        trim:true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
        required: true
    }
}, {timestamps:true}) /**this will automatically adds creadted_at and udpated_at */

module.exports = mongoose.model('Task', TaskSchema)