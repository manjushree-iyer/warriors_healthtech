// Temporary mock user model

let users = [];

const createUser = async (name, email, password, role) => {

  const user = {
    id: users.length + 1,
    name,
    email,
    password,
    role
  };

  users.push(user);

  return user;
};

const findUserByEmail = async (email) => {
  return users.find(user => user.email === email);
};

const findUserByAbhaId = async (abha_id) => {
  return users.find(user => user.abha_id === abha_id);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByAbhaId
};