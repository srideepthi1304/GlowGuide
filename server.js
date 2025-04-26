import express from 'express';
import path from 'path';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';

// Get the current directory path in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Allow cross-origin requests from frontend (adjust if necessary)
app.use(cors({
  origin: 'http://localhost:8080', // Frontend URL
}));

// Replace with your actual Google Cloud API key
const apiKey = 'AIzaSyC-erXuPBs7CyZ907Qch0QPFUHIGlvqvAg';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Serve static files from the "public" folder (e.g., HTML, JS, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Ensure the 'uploads' directory exists, or create it
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);  // Create uploads folder if it doesn't exist
  console.log('Uploads directory created');
}

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);  // Save to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));  // Unique filename
  }
});

const upload = multer({ storage: storage });

// Serve HTML form (or front-end) for testing file upload
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));  // Serve index.html
});

// Handle image upload and AI model processing
app.post("/upload", upload.single('image'), async (req, res) => {
  try {
    // Ensure file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get the path to the uploaded file
    const imagePath = req.file.path;
    console.log('Image uploaded:', imagePath);

    // Read image and convert it to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    console.log('Base64 Image:', base64Image.substring(0, 100)); // Log first 100 chars for sanity check

    // Define your prompt for the AI model
    const prompt = "describe the skin situation I'm in";

    // Construct the image object expected by your model
    const image = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/png',  // Adjust MIME type if the image is not PNG
      }
    };

    // Call the model's generateContent function
    const result = await model.generateContent([prompt, image]);
    console.log('Gemini API Result:', result.response.text()) ;
   // string 
    // Respond with the result from the model
    res.json({ text: result.response.text() });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
