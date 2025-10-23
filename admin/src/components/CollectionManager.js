import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CollectionManager() {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [collections, setCollections] = useState([]);

  const fetchCollections = async () => {
    const res = await axios.get("/schemas"); // Backend endpoint to list all schemas
    setCollections(res.data);
  };

  const createCollection = async () => {
    if (!description || !name) return alert("Fill all fields");
    const res = await axios.post("/schema", { description, name });
    alert("Collection created!");
    setDescription("");
    setName("");
    fetchCollections();
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Collection Manager</h1>
      <input
        type="text"
        placeholder="Collection Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <textarea
        placeholder="Describe collection (e.g., Product with title, price, images)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button onClick={createCollection} className="bg-blue-500 text-white p-2 rounded mb-4">
        Create Collection
      </button>

      <h2 className="text-lg font-semibold mb-2">Existing Collections</h2>
      <ul>
        {collections.map(c => (
          <li key={c.name} className="mb-1 border-b p-2">{c.name}</li>
        ))}
      </ul>
    </div>
  );
}