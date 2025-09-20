import bcrypt from "bcrypt";

const password = "password123";

async function run() {
  const hash = await bcrypt.hash(password, 10);
  console.log("Password hash:", hash);
}

run();
