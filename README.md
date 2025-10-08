# 🧠 General Final Practical Test

This repository contains the complete solution for the **General Final Practical Test**, which includes:

1. **Schema Design** – Users, Products, and Orders with Mongoose relationships  
2. **CRUD REST API** – Posts resource with proper route structure and error handling  
3. **File Upload API** – Upload image files using Multer and store file info in MongoDB  

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Multer** (for file upload)
- **dotenv**
- **Nodemon** (for development)

---

## 📁 Folder Structure
01_ques/
│
├── config/
│ └── db.js
│
├── controllers/
│ ├── fileController.js
│ └── postController.js
│
├── middleware/
│ └── uploadMiddleware.js
│
├── models/
│ ├── userModel.js
│ ├── productModel.js
│ ├── orderModel.js
│ ├── postModel.js
│ └── fileModel.js
│
├── routes/
│ ├── fileRoutes.js
│ └── postRoutes.js
│
├── uploads/ # Folder where images are stored
│
├── server.js # Main entry file
├── package.json
└── README.md

---


---

## ⚙️ Installation & Setup

```bash
git clone https://github.com/<your-username>/final_practical_test.git
cd final_practical_test
npm install
Create a .env file in the root folder:
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
Run the server:

```bash
git clone https://github.com/<your-username>/final_practical_test.git
cd final_practical_test
