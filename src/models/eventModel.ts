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
        type:Array,
        ref:"User",
        default:[],
    },
    capacity:{
        type:Number,
        required:[true,"capacity is required"],
    },
})

export default mongoose.models.Event || mongoose.model("Event",eventSchema);