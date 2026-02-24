const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.log("Usage: node hashPassword.js YourPasswordHere");
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log("Password:", password);
  console.log("Hashed Password:");
  console.log(hash);
});