// src/server.js
import express from "express";
import cors from "cors";
import slugify from "slugify";
import multer from "multer";
import { db } from "./firebase/firebaseConfig.js";
import { generateSchema } from "./claude.js";
import s3, { R2_BUCKET_NAME } from "./r2.js";
import { collection, doc, setDoc, getDocs, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// ---------------------------
// Helper: Upload image to R2
// ---------------------------
async function uploadImage(file) {
  const params = {
    Bucket: R2_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  const res = await s3.upload(params).promise();
  return res.Location;
}

// ---------------------------
// Endpoint: Create a collection schema
// ---------------------------
app.post("/schema", async (req, res) => {
  const { description, name } = req.body;
  try {
    const schema = await generateSchema(description);
    if (!schema) return res.status(400).json({ message: "Failed to generate schema" });

    await setDoc(doc(db, "schemas", name), { name, fields: schema, createdAt: new Date().toISOString() });
    res.json({ message: "Schema created", schema });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------
// Dynamic CRUD Endpoints
// ---------------------------

// Create document
app.post("/collection/:name", upload.array("images"), async (req, res) => {
  const { name } = req.params;
  const { data } = req.body; // data is JSON string
  let parsedData = JSON.parse(data);

  // Auto-slug
  if (parsedData.title) parsedData.slug = slugify(parsedData.title, { lower: true });

  // Upload images if present
  if (req.files && req.files.length) {
    parsedData.images = [];
    for (let file of req.files) {
      const url = await uploadImage(file);
      parsedData.images.push(url);
    }
  }

  // Add timestamps
  parsedData.createdAt = new Date().toISOString();
  parsedData.updatedAt = new Date().toISOString();

  try {
    const docRef = doc(db, name, Date.now().toString());
    await setDoc(docRef, parsedData);
    res.json({ message: "Document created", id: docRef.id, data: parsedData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all documents
app.get("/collection/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const snap = await getDocs(collection(db, name));
    const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single document
app.get("/collection/:name/:id", async (req, res) => {
  const { name, id } = req.params;
  try {
    const snap = await getDoc(doc(db, name, id));
    if (!snap.exists()) return res.status(404).json({ message: "Not found" });
    res.json({ id: snap.id, ...snap.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update document
app.put("/collection/:name/:id", upload.array("images"), async (req, res) => {
  const { name, id } = req.params;
  const { data } = req.body;
  let parsedData = JSON.parse(data);

  // Auto-slug
  if (parsedData.title) parsedData.slug = slugify(parsedData.title, { lower: true });

  // Upload new images
  if (req.files && req.files.length) {
    parsedData.images = parsedData.images || [];
    for (let file of req.files) {
      const url = await uploadImage(file);
      parsedData.images.push(url);
    }
  }

  parsedData.updatedAt = new Date().toISOString();

  try {
    await updateDoc(doc(db, name, id), parsedData);
    res.json({ message: "Document updated", data: parsedData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete document
app.delete("/collection/:name/:id", async (req, res) => {
  const { name, id } = req.params;
  try {
    await deleteDoc(doc(db, name, id));
    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------
app.listen(3000, () => {
  console.log("CMS backend running on port 3000");
});