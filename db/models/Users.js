import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String
})
 
const UserModel = model("users", UserSchema)
export default UserModel
