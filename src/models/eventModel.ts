import mongoose,{Schema} from "mongoose";

const eventSchema = new Schema({
    title:{
        type:String,
        required:[true,"title is required"],
    },
    description:{
        type:String,
        required:[true,"description is required"],
    },
    date:{
        type:Date,
        required:[true,"date is required"],
    },
    location:{
        type:String,
        required:[true,"location is required"],
    },
    category:{
        type:String,
        required:[true,"category is required"],
    },
    image:{ 
        type:String,
        required:[true,"image is required"],
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    totalParticipants:{
        type:Number,
        default:0,
    },
    registeredUsers:{
        type:[String],
        default:[],
    },
    capacity:{
        type:Number,
        required:[true,"capacity is required"],
    },
    tickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        default: []
    }]
});

// Ensure the model is registered only once
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;