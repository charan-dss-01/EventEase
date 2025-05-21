import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    clerkId: 
    {
         type: String, 
         unique: true 
    },
    // username: {
    //     type: String,
    //     required: false,
    //     default: function() {
    //         return `user_${Math.random().toString(36).substring(2, 8)}`;
    //     }
    // },
    email:{
        type:String,
        required:[true,"email is required"],
    },
    eventsParticipated:{
        type:Array,
        ref:"Event",
        default:[],
    },
    eventsCreated:{
        type:Array,
        ref:"Event",
        default:[],
    },
})


export default mongoose.models.User || mongoose.model("User",userSchema);