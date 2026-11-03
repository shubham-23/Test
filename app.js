// const express = require('express');
// const app = express();
// const port = 3000;

// app.use(express.json());


// let items = [];
// let nextId = 1;


// app.post('/items', (req, res) => {
//     const { name, value } = req.body;
//     if (!name || value === undefined) {
//         return res.status(400).json({ error: 'Name and value are required' });
//     }
//     const newItem = { id: nextId++, name, value };
//     items.push(newItem);
//     res.status(201).json(newItem);
// });


// app.get('/items', (req, res) => {
//     res.json(items);
// });


// app.get('/items/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     const item = items.find(i => i.id === id);
//     if (!item) {
//         return res.status(404).json({ error: 'Item not found' });
//     }
//     res.json(item);
// });


// app.put('/items/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     const { name, value } = req.body;
//     const item = items.find(i => i.id === id);
//     if (!item) {
//         return res.status(404).json({ error: 'Item not found' });
//     }
//     if (name !== undefined) item.name = name;
//     if (value !== undefined) item.value = value;
//     res.json(item);
// });

// app.delete('/items/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     const index = items.findIndex(i => i.id === id);
//     if (index === -1) {
//         return res.status(404).json({ error: 'Item not found' });
//     }
//     const deleted = items.splice(index, 1)[0];
//     res.json(deleted);
// });

// app.listen(port, () => {
//     console.log(`CRUD server listening at http://localhost:${port}`);
// });

require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);
// Store uploaded file information temporarily
let files = [];

// POST API - Upload image to Cloudinary
app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image"
      });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "my_images" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    const file = {
      name: req.file.originalname,
      url: result.secure_url
    };

    files.push(file);

    res.json({
      message: "Image uploaded successfully",
      data: file
    });
  } catch (error) {
    res.status(500).json({
      message: "Image upload failed"
    });
  }
});

// GET API - Show uploaded image information
app.get("/files", (req, res) => {
  res.json({
    totalFiles: files.length,
    data: files
  });
});


app.delete("/files/:publicId", async (req, res) => {
  try {
    const result = await cloudinary.uploader.destroy(
      "my_images/" + req.params.publicId
    );

    if (result.result !== "ok") {
      return res.status(404).json({
        message: "Image not found"
      });
    }

    res.json({
      message: "Image deleted successfully"
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Failed to delete image"
    });
  }
});



app.put("/files/:publicId", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a new image"
      });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "my_images",
          public_id: req.params.publicId,
          overwrite: true
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.json({
      message: "Image replaced successfully",
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Failed to replace image"
    });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
