import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema({ 
    user: { type: String },
    items: { type: [String] }
});

const todo = mongoose.model("todo", todoSchema);

export { todo };
