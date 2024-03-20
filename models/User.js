import mongoose, { Schema } from 'mongoose';

const UserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        profileImage: {
            type: String,
            required: false,
            default: "https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        // roles: {
        //     tpye: [Schema.Types.ObjectId],
        //     required: true,
        //     ref: "Role"
        // }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", UserSchema);