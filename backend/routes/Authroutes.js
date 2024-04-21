import express from 'express'
import { getallusers, loginuser, logout, register} from '../controllers/authcontrollers.js'


const userrouter = express.Router()

userrouter.post('/register',register)
userrouter.post('/login',loginuser)
userrouter.post('/logout',logout)
userrouter.get('/getallusers',getallusers)


export default userrouter