import express from "express"
import bodyParser from "body-parser"
import session from "express-session";
import connectMongo from "connect-mongo";  //npm i connect-mongo@3
import {connection,user,cart,wish} from "./database.js"
import bcrypt from "bcryptjs"
import {arr} from "./product_info.js"
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
const MongoStore = connectMongo(session)
const sessionStore = new MongoStore({
    mongooseConnection : connection,
    collection : 'sessions'
})
app.use(session({
    secret : "My Secret",
    resave : false,
    saveUninitialized : true,
    store : sessionStore,
    cookie : {
        maxAge : 7*1000*60*60*24   // 7 day in milisecond
    }
}))


app.get("/",async(req,res)=>{
    if(req.session.email){
        let brr = await wish.find({email:req.session.email});
        res.render("index.ejs",{arr:arr,brr:brr,flag:1});
    }
    else{
        res.render("index.ejs",{arr:arr,brr:[],flag:0});
    }
})
app.get("/r",(req,res)=>{
    res.render("registration.ejs");
})
app.get("/l",(req,res)=>{
    res.render("login.ejs");
})
app.post("/registration",async(req,res)=>{
   try{
      if(req.body.password===req.body.ConfirmPassword){
          
          const salt = await bcrypt.genSalt(10);
          const hPassword = await bcrypt.hash(req.body.password,salt);
          const a = new user({
             name : req.body.name,
             email: req.body.email,
             password:hPassword
          });
          a.save();
          res.redirect("/l");
      }
      else{
        res.redirect("/r");
      }
   }
   catch(err){
      console.log(err.message);
      res.redirect("/r");
   }
})
app.post("/login",async(req,res)=>{
   try{
      const a = await user.findOne({email:req.body.email});
      if(a){
          const is_match = await bcrypt.compare(req.body.password,a.password);
          if(is_match){
              req.session.email = req.body.email;
              res.redirect("/");
          }
          else{
            res.redirect("l");
          }
      }
      else{
        res.redirect("/r");
      }
   }
   catch(err){
      console.log(err.message);
      res.redirect("/l")
   }
})
app.get("/product/:id",(req,res)=>{
    let x = parseInt(req.params.id);
    if(req.session.email){
        res.render("product_detail.ejs",{arr:arr[x-1],flag:1});
    }
    else{
        res.render("product_detail.ejs",{arr:arr[x-1],flag:0});
    }
})
app.get("/Wishlist",async(req,res)=>{
    try{
        if(req.session.email){
            let index = [];
            let x = await wish.find({email:req.session.email});
            for(let i=0;i<x.length;i++){
                let s = x[i].id;
                let j = parseInt(s)-1;
                index.push(j);
            }
            res.render("wishlist.ejs",{brr:index,arr:arr});
        }
        else{
            res.render("before_login_wishlist.ejs");
        }
    }
    catch(err){
        console.log(err.message);
        res.redirect("/");
    }
})
app.get("/cart",async(req,res)=>{
    try{
        if(req.session.email){
            let index = [];
            let sz = [];
            let q = [];
            let x = await cart.find({email:req.session.email});
            for(let i=0;i<x.length;i++){
                let s = x[i].id;
                let j = parseInt(s)-1;
                index.push(j);
                q.push(x[i].qty)
                sz.push(x[i].size);
            }
            res.render("cart.ejs",{brr:index,arr:arr,qty:q,size:sz});
        }
        else{
            res.render("before_login_Cart.ejs");
        }
    }
    catch(err){
        console.log(err.message);
        res.redirect("/");
    }
})
app.get("/logout",(req,res)=>{
    req.session.email = undefined;
    res.redirect("/");
})
app.post("/AddToCart",async(req,res)=>{
    try{
        if(req.session.email){
            let z = await cart.findOne({email:req.session.email,id:req.body.name})
            if(z){
                res.redirect("/");  
            }
            else{
                let a = new cart({email:req.session.email,id:req.body.name,qty:req.body.quantity,size:req.body.SelectOption});
                a.save();
                res.redirect("/cart");
            }
        }
        else{
            res.redirect("/l");
        }
    }
    catch(err){
        console.log(err.message);
        res.redirect("/");
    }
})
app.post("/AddToWishlist",async(req,res)=>{
    try{
        if(req.session.email){ 
            let z = await wish.findOne({email:req.session.email,id:req.body.name})
            if(z){
                res.redirect("/");  
            }
            else{
                let a = new wish({email:req.session.email,id:req.body.name});
                a.save();
                res.redirect("/Wishlist");
            }
        }
        else{
            res.redirect("/l");
        }
    }
    catch(err){
        console.log(err.message);
        res.redirect("/");
    }
})
app.post("/remove_from_wishlist",async(req,res)=>{
    try{
        let s = req.body.name;
        let a = await wish.deleteOne({email:req.session.email,id:s});
        res.redirect("/Wishlist");
    }
    catch(err){
        console.log(err.message);
        res.redirect("/Wishlist")
    }
})
app.post("/remove_from_cart",async(req,res)=>{
    try{
        let s = req.body.rmv_btn;
        let a = await cart.deleteOne({email:req.session.email,id:s});
        res.redirect("/cart");
    }
    catch(err){
        console.log(err.message);
        res.redirect("/cart")
    }
})
app.listen(3000,()=>{
    console.log("Listening");
})