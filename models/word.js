import mongoose from 'mongoose';
const { Schema } = mongoose;

const wordSchema = new Schema({
    hiragana: String,
    meaning: String
})