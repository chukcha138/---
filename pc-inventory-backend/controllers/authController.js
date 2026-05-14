const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
  return res.status(400).json({
    message: "Заполните все поля"
  });
}

  const user = await User.findOne({ username });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Пользователь не найден" });
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    return res
      .status(400)
      .json({ message: "Неверный пароль" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );

console.log(user);

  res.json({
  token,
  role: user.role
});
};

exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
  return res.status(400).json({
    message: "Заполните все поля"
  });
}

  const existingUser = await User.findOne({
    username
  });

  if (existingUser) {
    return res.status(400).json({
      message: "Пользователь уже существует"
    });
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  const user = new User({
    username,
    password: hashedPassword,
    role: role || "user"
  });

  await user.save();

  res.json({
    message: "Пользователь создан"
  });
};