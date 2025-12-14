const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const path = require("path");

const userModel = require("./models/userModel");
const sweetModel = require("./models/sweetModel");

dotenv.config({ path: path.join(__dirname, ".env") });

const connectDb = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("DB connected for seeding");
};

const seedData = async () => {
  try {
    await connectDb();

    // CLEAR OLD DATA
    await userModel.deleteMany();
    await sweetModel.deleteMany();

    // PASSWORD
    const hashedPassword = await bcrypt.hash("123456", 10);

    // USERS
    const users = await userModel.insertMany([
      {
        userName: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        address: ["HQ"],
        phone: "1111111111",
        usertype: "admin",
        answer: "admin",
      },
      {
        userName: "User",
        email: "user@gmail.com",
        password: hashedPassword,
        address: ["Mumbai"],
        phone: "2222222222",
        usertype: "client",
        answer: "user",
      },
    ]);

    // SWEETS
    const sweets = await sweetModel.insertMany([
      {
        name: "Laddu",
        category: "Indian",
        price: 20,
        quantity: 50,
      },
      {
        name: "Barfi",
        category: "Indian",
        price: 30,
        quantity: 40,
      },
      {
        name: "Chocolate",
        category: "Western",
        price: 10,
        quantity: 100,
      },
    ]);

    console.log("✅ Seed data inserted");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedData();
