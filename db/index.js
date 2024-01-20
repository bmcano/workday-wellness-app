import express, { json } from 'express'
import { connect } from 'mongoose'
import cors from 'cors'
import UserModel from './models/Users.js'

const app = express()
app.use(cors())
app.use(json())

connect("mongodb://localhost:27017/wellness-app")

app.get('/getUser', (req, res) => {
    UserModel.find()
        .then(users => res.json(users))
        .catch(err => res.json(err))
})

app.post('/register', async (req, res) => {
    try {
        const user = new UserModel(req.body);
        let result = await user.save();
        result = result.toObject();
        if (result) {
            res.send(req.body);
            console.log(result);
        } else {
            console.log("User already exists");
        }
    } catch (e) {
        res.send("Something went wrong");
    }
})

app.listen(3001, () => {
    console.log("Database is running")
})