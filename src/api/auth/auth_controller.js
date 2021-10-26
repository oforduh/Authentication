import UserModel from "../../model/UserModel.js";

export const handleUserRegistration = async (req, res) => {
  const { email, name, password, phoneNumber } = req.body;

  try {
    const user = new UserModel({ email, name, password, phoneNumber });
    await user.save();
    const token = user.generateAuthToken();
    res.status(200).json({ data: token });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
