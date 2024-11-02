import { useEffect, useState } from "react";
import useDebounce from "../Hooks/useDebounce";
import Features from "./Features";
import Loading from "./Loading";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const [products, setProducts] = useState([]); // State for products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("LowToHigh"); // State for choosing sort order
  const [originalProducts, setOriginalProducts] = useState([]); // from category/search to no category/no search comeback to initial products
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce(searchInput, 500); // debounced search input with 0.5s
  const [cart, setCart] = useState([]); // products those are added in cart

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    fetch("https://fakestoreapi.com/products")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch products!");
        return response.json();
      })
      .then((data) => {
        setProducts(data); // fetched data to products state
        setOriginalProducts(data); // keeping initial data in originalProducts state
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const fetchProductsByCategory = (category) => {
    setLoading(true);
    if (category) {
      fetch(`https://fakestoreapi.com/products/category/${category}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch products!");
          return response.json();
        })
        .then((data) => {
          setProducts(data); // selected category products to productList
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      setProducts(originalProducts); // when category is deselected products becomes initial products
      setLoading(false);
    }
  };

  const searchedProducts = products.filter(
    // search products from products list
    (product) =>
      product.title.toLowerCase().includes(debouncedSearchInput.toLowerCase()) // search products by not searchInput but debouncedSearchInput
  );

  const sortedProducts = [...searchedProducts].sort((a, b) => {
    // sorted products from searched products
    return sortOrder === "LowToHigh" ? a.price - b.price : b.price - a.price;
  });

  const addToCart = (product) => {
    setCart((prevCart) => {
      const isProductInCart = prevCart.find((item) => item.id === product.id);
      if (isProductInCart) {
        // product already in the cart
        return prevCart.filter((item) => item.id !== product.id); // remove the product
      } else {
        // Add the product
        return [...prevCart, product];
      }
    });
  };

  return (
    <div>
      <Features
        onSort={setSortOrder} // Set order on which products will be sorted
        onCategorySelect={fetchProductsByCategory} // State for selected category product display
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        cartCount={cart.length}
      />

      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:max-w-7xl lg:px-8">
        {loading && <Loading />}
      </div>

      {error && (
        <p className="text-center text-2xl text-red-500 font-semibold mt-4">
          {error}
        </p>
      )}

      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {!loading &&
              !error &&
              sortedProducts.map(
                // map products from sorted products
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    isInCart={cart.some((item) => item.id === product.id)} // if this product is in cartArray or not
                  />
                )
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
