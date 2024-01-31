import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    stub_data: { type: Boolean, required: false },
    friends: { type: [String], default: [] }
});

const UserModel = model("users", UserSchema);
export default UserModel;
