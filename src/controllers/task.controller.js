const Task = require('../models/task.model')
const validateRequest = require('../utils/RequestValidation')

// Get task statistics
exports.getTaskStats = async (req, res) => {
    try {
        const stats = await Task.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Format the response
        const formattedStats = {
            pending: 0,
            'in-progress': 0,
            completed: 0,
            total: 0
        };
        
        stats.forEach(stat => {
            formattedStats[stat._id] = stat.count;
            formattedStats.total += stat.count;
        });
        
        res.status(200).json({
            message: "Task statistics retrieved successfully",
            data: formattedStats
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: error.message
        });
    }
};

exports.createTask = async (req, res) => {
    try {
        validateRequest(req.body, ['title', 'description', 'deadline'])

        const task = new Task({
            title       : req.body.title,
            description : req.body.description,
            deadline    : req.body.deadline,
            dateStarted : req.body.dateStarted || Date.now() // fallback to now
        })

        const new_task = await task.save();

        res.status(201).json({
            message: "Successfully created new task",
            data: new_task
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}


exports.getAllTask = async (req, res) => {
    try{
        const { search, status } = req.query;
        
        // Build query object
        let query = {};
        
        // Add search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Add status filter
        if (status) {
            // Validate status value
            const validStatuses = ['pending', 'in-progress', 'completed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
                });
            }
            query.status = status;
        }
        
        const tasks = await Task.find(query).sort({ createdAt: -1 });
        
        res.status(200).json({
            message: `Found ${tasks.length} task(s)`,
            data: tasks
        })
    }catch(error){
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}

exports.getTaskById = async (req, res) => {
    try{
        // res.json(req.params.task_id)
        const task = await Task.findById(req.params.task_id)

        if(!task) {
            return res.status(404).json({
                message: "Task not found"
            })
        }

        res.status(200).json({
            data: task
        })
    }catch(error){
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}

exports.deleteTaskById = async (req, res) => {
    try{
        const is_deleted = await Task.findByIdAndDelete(req.params.task_id)
        if(!is_deleted) {
            return res.status(404).json({
                message: "Task not found and unable to delete it"
            })
        }
        res.status(200).json({
            message: "Task has been deleted"
        })
    }catch(error){
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}

exports.updateTaskById = async (req, res) => {
    try {
        const updatedData = req.body;

        if (updatedData.status) {
            const validStatuses = ['pending', 'in-progress', 'completed'];
            if (!validStatuses.includes(updatedData.status)) {
                return res.status(400).json({
                    message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
                });
            }
        }

        const updated_task = await Task.findByIdAndUpdate(
            req.params.task_id,
            updatedData,
            { new: true, runValidators: true }
        )

        if (!updated_task) {
            return res.status(404).json({
                message: "Task not found and unable to update it"
            })
        }

        res.status(200).json({
            message: "Updated the task successfully",
            data: updated_task
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}


exports.markTaskAsComplete = async (req, res) => {
    try{
        const updated_task = await Task.findByIdAndUpdate(
            req.params.task_id,
            {
                status: 'completed'
            },
            {
                new:true,
                runValidators:true
            }
        )

        if(!updated_task){
            return res.status(404).json({
                message: "Task not found and unable to update it"
            })
        }

        res.status(200).json({
            message: "Updated the task successfully",
            data: updated_task
        })  

    }catch(error){
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}