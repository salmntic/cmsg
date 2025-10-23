import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-2">Products</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Slug</th>
            <th className="border px-2 py-1">Price</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Discount</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td className="border px-2 py-1">{p.title}</td>
              <td className="border px-2 py-1">{p.slug}</td>
              <td className="border px-2 py-1">৳{p.price}</td>
              <td className="border px-2 py-1">{p.status}</td>
              <td className="border px-2 py-1">{p.discountType === 'percent' ? p.discountValue + '%' : '৳' + p.discountValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;