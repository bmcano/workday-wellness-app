import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
    email: String,
    password: String,
    first_name: String,
    last_name: String
})
 
const UserModel = model("users", UserSchema)
export default UserModel
