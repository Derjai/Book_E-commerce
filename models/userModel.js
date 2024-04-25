const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    deletedOn: {type: Date, required: false}
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('Users', userSchema);

module.exports = User;