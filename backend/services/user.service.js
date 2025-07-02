import userModel from '../models/user.model.js';

export const createUser = async ({
    email,password
})=>{
    if(!email || !password){
        throw new Error("Email and password are required");
    }
    const user = await userModel.create({
        email,
        password: await userModel.hashPassword(password)
    });
    return user;
}
export const getAllUsers = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const users = await userModel.find({ _id: { $ne: userId } }).select("_id email");
  return users;
};
