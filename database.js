import mongoose from "mongoose";
mongoose.connect("mongodb://127.0.0.1:27017/E-Commerce");
export const connection = mongoose.connection;
const UserSchema = new mongoose.Schema({
    name : String,
    email:{
        type:String,
        unique:true
    },
    password:String
})
const CartSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    id:{
        type:String,
        unique:true,
        required:true
    },
    qty:Number,
    size:String
})
const WishSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    id:{
        type:String,
        unique:true,
        required:true
    }
})
export const user = mongoose.model("user",UserSchema);
export const cart = mongoose.model("cart",CartSchema);
export const wish = mongoose.model("wish",WishSchema);
