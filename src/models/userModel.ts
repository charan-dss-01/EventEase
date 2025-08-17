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
    role: {
    type: String,
    enum: ['user', 'collegeLead', 'admin'],
    default: 'user'
    },
    collegeLeadRequest: {
    type: String,
    enum: ['pending', 'approved', 'rejected', null],
    default: null
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
    isAdmin: {
        type: Boolean,
        default: false
    },
    isCollegeLead: {
        type: Boolean,
        default: false
    },

    collegeInfo:
        {
            collegeName:{
                type:String,
                default: ''
            },
            degree:{
                type:String,
                default: ''
            },
            yearOfPassing:{
                type:Number,
                default: null
            },
            agenda:{
                type:String,
                default: ''
            }
        },
        requestedId:[
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                default: null
            }
        ],
        profilePicture: {
            type: String,
            default: ''
        }

},{timestamps:true})


export default mongoose.models.User || mongoose.model("User",userSchema);