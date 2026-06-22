import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const isAdmin = true;
  const [cartItems, setCartItems] = useState([]);
  const [backendMessage, setBackendMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [toast, setToast] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [newProduct, setNewProduct] = useState({
  id: "",
  name: "",
  price: "",
  category: "",
  rating: "",
  image: "",
});

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/message")
      .then((res) => res.json())
      .then((data) => {
        setBackendMessage(data.message);
      });

    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);

  const addToCart = (name, price) => {
  setCartItems([...cartItems, { name, price }]);

  setToast(`✅ ${name} added to cart`);

  setTimeout(() => {
    setToast("");
  }, 2000);
};
const toggleWishlist = (productId) => {
  if (wishlist.includes(productId)) {
    setWishlist(
      wishlist.filter((id) => id !== productId)
    );
  } else {
    setWishlist([...wishlist, productId]);

    setToast("❤️ Added to Wishlist");

    setTimeout(() => {
      setToast("");
    }, 2000);
  }
};

  const removeFromCart = (indexToRemove) => {
    const updatedCart = cartItems.filter(
      (_, index) => index !== indexToRemove
    );
    setCartItems(updatedCart);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price,
    0
  );
  const addProduct = async () => {
  if (
    !newProduct.name ||
    !newProduct.price ||
    !newProduct.category ||
    !newProduct.image
  ) {
    alert("Please fill all fields");
    return;
  }

  try {
    await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    alert("✅ Product Added Successfully");
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};
const deleteProduct = async (mongoId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  try {
    await fetch(
      `http://localhost:5000/products/${mongoId}`,
      {
        method: "DELETE",
      }
    );

    alert("🗑️ Product Deleted");

    setProducts(
      products.filter(
        (product) => product._id !== mongoId
      )
    );
  } catch (error) {
    console.log(error);
  }
};

  return (
  <div className={darkMode ? "dark" : ""}>
    {toast && (
      <div className="toast">
        {toast}
      </div>
    )}
      <header className="navbar">
        <h1>ShopEase</h1>

        <div className="menu">
          <a href="#">Home</a>
          <a href="#">Products</a>
          <a href="#">Contact</a>
          <button
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? "☀️ Light" : "🌙 Dark"}
</button>

          <div
  style={{
    display: "flex",
    gap: "10px",
  }}
>
  <button>
    ❤️ ({wishlist.length})
  </button>

  <button onClick={() => setShowCart(true)}>
    Cart 🛒 ({cartItems.length})
  </button>
</div>
        </div>
      </header>

      <section className="hero">
        <div>
          <h2>Premium Shopping Experience</h2>

          <p>
            Discover amazing products at unbeatable prices.
          </p>

          <h3>{backendMessage}</h3>

          <button className="shop-btn">
            Shop Now
          </button>
        </div>
      </section>

      <section
        style={{
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Our Products
        </h2>

        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          style={{
            width: "350px",
            padding: "12px",
            borderRadius: "10px",
            border: "2px solid #2563eb",
            fontSize: "16px",
          }}
        />

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            className="filter-btn"
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>

          <button
            className="filter-btn"
            onClick={() =>
              setSelectedCategory("Electronics")
            }
          >
            Electronics
          </button>

          <button
            className="filter-btn"
            onClick={() =>
              setSelectedCategory("Fashion")
            }
          >
            Fashion
          </button>

          <button
            className="filter-btn"
            onClick={() =>
              setSelectedCategory("Accessories")
            }
          >
            Accessories
          </button>
          <div
  style={{
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
  }}
>
  <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
    style={{
      padding: "12px",
      borderRadius: "10px",
      border: "2px solid #2563eb",
      fontSize: "16px",
    }}
  >
    <option value="">Sort By Price</option>
    <option value="lowToHigh">
      Price: Low → High
    </option>
    <option value="highToLow">
      Price: High → Low
    </option>
  </select>
</div>
        </div>
      </section>

      <section className="products">
        {products
          .filter((product) =>
            product.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
          .filter(
  (product) =>
    selectedCategory === "All" ||
    product.category === selectedCategory
)
.sort((a, b) => {
  if (sortOrder === "lowToHigh") {
    return a.price - b.price;
  }

  if (sortOrder === "highToLow") {
    return b.price - a.price;
  }

  return 0;
})
.map((product) => (
            <div
              className="card"
              key={product.id}
            >
              <img
                src={product.image}
                alt={product.name}
              />

              <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
  }}
>
  <h3>{product.name}</h3>

  <button
    onClick={() =>
      toggleWishlist(product.id)
    }
    style={{
      border: "none",
      background: "none",
      cursor: "pointer",
      fontSize: "24px",
    }}
  >
    {wishlist.includes(product.id)
      ? "❤️"
      : "🤍"}
  </button>
</div>

<p
  style={{
    fontSize: "22px",
    fontWeight: "bold",
    color: "#2563eb",
    paddingLeft: "15px",
  }}
>
  ₹{product.price}
</p>

<div
  style={{
    color: "#f59e0b",
    fontSize: "18px",
    fontWeight: "bold",
  }}
>
  ⭐⭐⭐⭐⭐ {product.rating}
</div>

              <button
                onClick={() =>
                  addToCart(
                    product.name,
                    product.price
                  )
                }
              >
                Add to Cart
              </button>
              {isAdmin && (
  <button
    onClick={() => deleteProduct(product._id)}
    style={{
      marginTop: "10px",
      background: "#ef4444",
      color: "white",
      border: "none",
      padding: "10px",
      borderRadius: "8px",
      cursor: "pointer",
      width: "100%",
    }}
  >
    🗑 Delete Product
  </button>
)}
            </div>
          ))}
      </section>
      <section
  style={{
    background: "white",
    margin: "30px",
    padding: "20px",
    borderRadius: "15px",
  }}
>
  <h2>➕ Add Product (Admin)</h2>

  <input
    placeholder="ID"
    onChange={(e) =>
      setNewProduct({
        ...newProduct,
        id: Number(e.target.value),
      })
    }
  />

  <input
    placeholder="Product Name"
    onChange={(e) =>
      setNewProduct({
        ...newProduct,
        name: e.target.value,
      })
    }
  />

  <input
    placeholder="Price"
    onChange={(e) =>
      setNewProduct({
        ...newProduct,
        price: Number(e.target.value),
      })
    }
  />

  <input
    placeholder="Category"
    onChange={(e) =>
      setNewProduct({
        ...newProduct,
        category: e.target.value,
      })
    }
  />

  <input
    placeholder="Rating"
    onChange={(e) =>
      setNewProduct({
        ...newProduct,
        rating: Number(e.target.value),
      })
    }
  />

  <input
    placeholder="Image URL"
    onChange={(e) =>
      setNewProduct({
        ...newProduct,
        image: e.target.value,
      })
    }
  />

  <button onClick={addProduct}>
    Add Product
  </button>
</section>
      {showCart && (
        <div className="cart-popup">
          <div className="cart-content">
            <div className="cart-header">
              <h2>🛒 Your Cart</h2>

              <button
                className="close-btn"
                onClick={() =>
                  setShowCart(false)
                }
              >
                ✖
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p>No items in cart</p>
            ) : (
              <>
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="cart-item"
                  >
                    <span>
                      {item.name} - ₹{item.price}
                    </span>

                    <button
                      className="remove-btn"
                      onClick={() =>
                        removeFromCart(index)
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <hr />

<h3>
  Total: ₹{totalPrice}
</h3>

<button
  className="checkout-btn"
  onClick={() => {
    alert(
  "🎊 Thank You!\n\nYour purchase was successful.\nWe appreciate your trust in ShopEase."
);

    setCartItems([]);
    setShowCart(false);
  }}
>
  Proceed to Checkout
</button>
              </>
            )}
          </div>
        </div>
      )}
      <footer
  style={{
    textAlign: "center",
    padding: "20px",
    marginTop: "40px",
    background: "#2563eb",
    color: "white",
  }}
>
  © 2026 ShopEase | Built with React, Node.js & MongoDB Atlas
</footer>
    </div>
  );
}

export default App;