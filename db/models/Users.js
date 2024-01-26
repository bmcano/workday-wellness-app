import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: false },
    first_name: { type: String, required: true, unique: false },
    last_name: { type: String, required: true, unique: false },
    stub_data: { type: Boolean, required: false, unique: false }
});

const UserModel = model("users", UserSchema);
export default UserModel;
