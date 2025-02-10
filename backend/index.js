const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");
const jwt = require("jsonwebtoken");
const { error, log } = require("console");
const { prependListener } = require("process");

app.use(express.json());
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'upload/images'))); // Serve images

// Database Connection With MongoDB
mongoose.connect("mongodb+srv://anishalabi163:MyWork81879876@cluster0.nsqlp.mongodb.net/")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
    });

// API Creation
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: "File upload failed" });
    }
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Schema for creating products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    }
});

// Route to add a product
app.post('/addProduct', async (req, res) => {
    const products = await Product.find({});
    let id;

    // Check if products exist, and if so, get the last product's ID and increment it
    if (products.length > 0) {
        const last_product = products[products.length - 1];
        id = last_product.id + 1; // Increment the last ID
    } else {
        id = 1; // Start with ID 1 if no products exist
    }

    // Create a new product with the id
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });

    try {
        await product.save(); // Save the new product to the database
        console.log("Product saved:", product);
        res.json({
            success: true,
            product: product // Return the saved product
        });
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({
            success: false,
            message: "Error saving product"
        });
    }
});

// Creating API for deleting Products
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    });
});

// Creating API for getting all products
app.get('/allproducts', async (req, res) => {
    const products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
});

// Shema creating for User model

const Users = mongoose.model('Users',{
    name:{
        type:String,  
    },
    email:{
        type:String,
        unique:true,

    },
    password:{
        type:String,

    },
    cartData:{
        type:Object,
    },
    date:{
          type:Date,
          default:Date.now,
    }
})


//Creating Endpoint for resigtering the user
app.post('/signup',async (req,res)=>{
    let check = await Users.findOne({email:req.body.email});
    if (check) {
       return res.status(400).json({success:false,errors:"existing user found with same email address"})

    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

   const data ={
    user:{
        id:user.id
    }
   }
    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})


//creating endpoint for userlogin
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if (user) {
        const passCompare = req.body.password ===user.password;
        if (passCompare) {
            const data ={
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,error:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"});
    }
})

// create endpoint for newcollection data 
app.get('/newcollections',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})

// creating endpoint for popualr in women section 
app.get('/popularinwomen',async (req,res)=>{
     let products = await Product.find({category:"women"});
     let popular_in_women = products.slice(0,4);
     console.log("Popular in women fetched");
     res.send(popular_in_women);
})


//creating endpoint for adding products in cartdata
app.post('/addtocart',async ()=>(req,res)=>{

})


// Start Server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error: " + error);
    }
});
