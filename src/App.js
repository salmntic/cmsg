import React from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>CMS Admin Panel</h1>
      <ProductForm />
      <hr />
      <ProductList />
    </div>
  );
}

export default App;