import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProductForm({ collectionName, schema }) {
  const [formData, setFormData] = useState({});
  const [images, setImages] = useState([]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageChange = e => {
    setImages([...e.target.files]);
  };

  const submitForm = async () => {
    const data = new FormData();
    data.append("data", JSON.stringify(formData));
    images.forEach(img => data.append("images", img));
    await axios.post(`/collection/${collectionName}`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    alert("Document created!");
    setFormData({});
    setImages([]);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">{collectionName} Form</h2>
      {Object.keys(schema.fields).map(field => (
        <div key={field} className="mb-2">
          {field === "images" ? (
            <input type="file" multiple onChange={handleImageChange} />
          ) : (
            <input
              type="text"
              placeholder={field}
              value={formData[field] || ""}
              onChange={e => handleChange(field, e.target.value)}
              className="border p-2 w-full"
            />
          )}
        </div>
      ))}
      <button onClick={submitForm} className="bg-green-500 text-white p-2 rounded">
        Submit
      </button>
    </div>
  );
}