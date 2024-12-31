import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	email: { type: String, required: true },
	authentication: {
		password: { type: String, required: true, select: false },
		salt: { type: String, select: false },
		sessionToken: { type: String, select: false }
	},
	following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export const userModel = mongoose.model('User', userSchema);

export const getUsers = () => userModel.find();
export const getUserByID = (id: string) => userModel.findById(id);
export const getUserByEmail = (email: string) => userModel.findOne({ email });
export const getUserByUsername = (username: string) => userModel.findOne({ username });
export const getFollowersByUserID = (id: string) => userModel.find({ following: new mongoose.Types.ObjectId(id) }).select('_id');

export const createUser = (values: Record<string, any>) => userModel.create(values);
export const deleteUserById = (id: string) => userModel.findOneAndDelete({_id: id});
export const updateUserById = (id: string, values: Record<string, any>) => userModel.findOneAndUpdate({ _id: id }, values);