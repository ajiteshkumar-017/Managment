import mongoose from "mongoose"


const MONGODB_URL = process.env.MONGODB_URL;

if(!MONGODB_URL){
    console.log("No env file is loaded.")
    
}

const cached = (global as any).mongoose || {
    connection : null,
    promise: null
}


export default async function Connect(){
    try {

        if(cached.connection){
            console.log("Already Connected to DB.")
            return cached.connection
            
        }

        if(!cached.promise){
            cached.promise = mongoose.connect(MONGODB_URL!).then(() => {
                console.log("Connected to MongoDb")
                return mongoose
            })

             cached.connection = await cached.promise;

             (global as any).mongoose = cached;

             console.log("MongoDB Connected ✅");
             return cached.connection

        }


        
    } catch (err:any) {
        console.log("Error in Connecting to Database")
        throw new Error(`Error connecting to MongoDB: ${err.message}`)
        
    }
}


