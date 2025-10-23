import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductList({ collectionName }) {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const res = await axios.get(`/collection/${collectionName}`);
    setItems(res.data);
  };

  useEffect(() => { fetchItems(); }, []);

  const deleteItem = async (id) => {
    await axios.delete(`/collection/${collectionName}/${id}`);
    fetchItems();
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">{collectionName} List</h2>
      {items.map(item => (
        <div key={item.id} className="border p-2 mb-2 flex justify-between">
          <span>{item.title || item.id}</span>
          <button onClick={() => deleteItem(item.id)} className="bg-red-500 text-white p-1 rounded">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}