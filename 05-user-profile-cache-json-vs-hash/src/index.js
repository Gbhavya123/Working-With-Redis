import express from "express";
import redis from 'ioredis';

const app = express();
app.use(express.json());

const redisClient = new redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.post('/user/:id/json',async(req, res)=>{
    redisClient.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
    res.json({"saved as" : "JSON"});
});

app.get('/user/:id/json', async(req,res)=>{
    const userData = await redisClient.get(`user:${req.params.id}:json`);
    if(userData){
        res.json(JSON.parse(userData));
    }else{
        res.status(404).json({"error": "User not found"});
    }
})

app.post('/user/:id/hash', async(req,res)=>{
    redisClient.hmset(`user:${req.params.id}:hash`, req.body);
    res.json({"saved as" : "HASH"});
});

app.get('/user/:id/hash', async(req,res)=>{
    const userData = await redisClient.hgetall(`user:${req.params.id}:hash`);
    if(Object.keys(userData).length > 0){
        res.json(userData);
    }else{
        res.status(404).json({"error": "User not found"});
    }
});

app.listen(3000,()=>{
    console.log("Server is running on port http://localhost:3000");
})