require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Post = require('./models/Post');

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Middleware
app.use(express.urlencoded({extended: true}));

// Routes
app.get('/', (req,res)=>{
    res.send('Index')
})

app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.send(posts);
    } catch (error) {
        res.send("Error fetching posts");
    }
});

app.post('/posts', async(req,res)=>{
    try{
        console.log(req.body);

        const newPost = new Post(req.body);
        await newPost.save();

        res.send("Post created successfully ✅");
    } catch(error) {
        res.send('Error creating post!!')
        console.log(error)
    }
})

app.listen(5000, ()=>{
    console.log('Listening to port 5000!!!')
})



