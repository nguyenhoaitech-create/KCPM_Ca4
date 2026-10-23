const users = [
  {
    id: 1,
    username: "admin",
    password: "password123",
    email: "admin@its.vn",
    full_name: "Admin System",
  },
];

exports.findUser = (username, password) => {
  return users.find((u) => u.username === username && u.password === password);
};
