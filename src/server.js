import express from "express";
import { db } from "./firebase/firebaseConfig.js";
import { addDoc, collection } from "firebase/firestore";
import { generateProductContent } from "./claude.js";

const app = express();
app.use(express.json());

// Endpoint: Submit short product description, save generated product
app.post("/product/create", async (req, res) => {
  const { productInput } = req.body;

  if (!productInput) {
    return res.status(400).json({ error: "productInput is required" });
  }

  try {
    // Step 1: Generate product content via Claude
    const product = await generateProductContent(productInput);

    if (!product) {
      return res.status(500).json({ error: "Failed to generate product content" });
    }

    // Step 2: Save in Firestore
    const docRef = await addDoc(collection(db, "products"), product);

    res.json({
      id: docRef.id,
      ...product
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log("Headless CMS running on port 4000"));