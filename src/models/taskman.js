import mongoose from "mongoose";

const taskData = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  tasks:{
    type:[
        {
            taskname:String,
            description:String,
            priority:String,
            category:String,
            due:Date,
            completed:Boolean,

        }
    ],
    default:[],
  }
  
});
const Task =
  mongoose.models.taskDetails || mongoose.model("taskDetails", taskData);
export default Task;