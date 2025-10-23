import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function ProductForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountType, setDiscountType] = useState("fixed");
  const [discountValue, setDiscountValue] = useState(0);
  const [status, setStatus] = useState("in_stock");
  const [specifications, setSpecifications] = useState([{ key: "", value: "" }]);

  const handleAddSpec = () => setSpecifications([...specifications, { key: "", value: "" }]);
  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const slug = title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    try {
      await addDoc(collection(db, "products"), {
        title,
        slug,
        description,
        metaTitle,
        metaDescription,
        price: parseFloat(price),
        discountType,
        discountValue: parseFloat(discountValue),
        status,
        currency: "BDT",
        specifications,
        createdAt: serverTimestamp()
      });
      alert("Product added!");
      setTitle(""); setDescription(""); setMetaTitle(""); setMetaDescription("");
      setPrice(""); setDiscountType("fixed"); setDiscountValue(0); setStatus("in_stock");
      setSpecifications([{ key: "", value: "" }]);
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow mb-6">
      <h2 className="text-lg font-bold mb-2">Add Product</h2>
      <input className="w-full mb-2 p-2 border rounded" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <input className="w-full mb-2 p-2 border rounded" placeholder="Meta Title" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} />
      <textarea className="w-full mb-2 p-2 border rounded" placeholder="Meta Description" value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />
      <textarea className="w-full mb-2 p-2 border rounded" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <input className="w-full mb-2 p-2 border rounded" type="number" placeholder="Price (BDT)" value={price} onChange={e => setPrice(e.target.value)} required />

      <div className="flex mb-2 space-x-2">
        <select className="p-2 border rounded" value={discountType} onChange={e => setDiscountType(e.target.value)}>
          <option value="fixed">Fixed</option>
          <option value="percent">Percent</option>
        </select>
        <input className="p-2 border rounded flex-1" type="number" placeholder="Discount Value" value={discountValue} onChange={e => setDiscountValue(e.target.value)} />
      </div>

      <select className="w-full mb-2 p-2 border rounded" value={status} onChange={e => setStatus(e.target.value)}>
        <option value="in_stock">In Stock</option>
        <option value="preorder">Preorder</option>
        <option value="out_of_stock">Out of Stock</option>
      </select>

      <div className="mb-2">
        <h3 className="font-semibold">Specifications</h3>
        {specifications.map((spec, i) => (
          <div key={i} className="flex mb-1 space-x-2">
            <input className="p-2 border rounded flex-1" placeholder="Key" value={spec.key} onChange={e => handleSpecChange(i, "key", e.target.value)} />
            <input className="p-2 border rounded flex-1" placeholder="Value" value={spec.value} onChange={e => handleSpecChange(i, "value", e.target.value)} />
          </div>
        ))}
        <button type="button" className="text-sm text-blue-500" onClick={handleAddSpec}>+ Add Spec</button>
      </div>

      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Add Product</button>
    </form>
  );
}

export default ProductForm;