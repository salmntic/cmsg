import React, { useState, useEffect } from "react";
import CollectionManager from "./components/CollectionManager";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import axios from "axios";

export default function App() {
  const [selectedCollection, setSelectedCollection] = useState("");
  const [schemas, setSchemas] = useState({});

  const fetchSchemas = async () => {
    const res = await axios.get("/schemas");
    const obj = {};
    res.data.forEach(c => { obj[c.name] = c; });
    setSchemas(obj);
  };

  useEffect(() => { fetchSchemas(); }, []);

  return (
    <div className="p-4">
      <CollectionManager />
      <hr className="my-4" />
      <h2 className="text-lg font-bold mb-2">Manage Documents</h2>
      <select
        className="border p-2 mb-4 w-full"
        value={selectedCollection}
        onChange={e => setSelectedCollection(e.target.value)}
      >
        <option value="">Select Collection</option>
        {Object.keys(schemas).map(name => <option key={name} value={name}>{name}</option>)}
      </select>

      {selectedCollection && (
        <>
          <ProductForm collectionName={selectedCollection} schema={schemas[selectedCollection]} />
          <ProductList collectionName={selectedCollection} />
        </>
      )}
    </div>
  );
}