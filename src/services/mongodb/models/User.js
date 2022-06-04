import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        minlength: 1,
    },
    lastName: {
        type: String,
        default: '',
        minlength: 1,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    }
})

const User = mongoose.model("User", UserSchema)

export default User