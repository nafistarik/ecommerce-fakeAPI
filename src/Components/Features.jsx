/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import CartSVG from "./SVG Components/CartSVG";
import DownArrowSVG from "./SVG Components/DownArrowSVG";
import SearchSVG from "./SVG Components/SearchSVG";

export default function Features({
  onSort, // Set order on which products will be sorted
  onCategorySelect, // State for selected category product display
  setSearchInput, // Set search input on typing
  searchInput,
  cartCount,
}) {
  const [showSortOptions, setShowSortOptions] = useState(false); // sort options visible or not

  const [showFilterOptions, setShowFilterOptions] = useState(false); // filter options visible or not

  const [categories, setCategories] = useState([]); // what categories are there

  const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category checkbox

  // Fetch categories from the categories URL
  useEffect(() => {
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data)) // these are the categories
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleSortOption = (sortOrder) => {
    onSort(sortOrder); // sorting will be done by this order
    setShowSortOptions(false); // sort is done, so closing sort options
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      // Already selected category
      setSelectedCategory(null); //deselecting for checkbox
      onCategorySelect(null); //deselecting for product display
    } else {
      // New category
      setSelectedCategory(category); //selecting for checkbox
      onCategorySelect(category); //selecting for product display
    }
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                onClick={() => setShowSortOptions((prev) => !prev)} // click to show sort options/close sort options
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-400 hover:text-gray-500 focus:text-gray-700 transition-all"
                id="menu-button"
                aria-expanded={showSortOptions}
                aria-haspopup="true"
              >
                Sort
                <DownArrowSVG />
              </button>
            </div>

            {showSortOptions && (
              <div
                className="absolute z-10 mt-2 left-5 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
              >
                <div className="py-1" role="none">
                  <span
                    onClick={() => handleSortOption("LowToHigh")} // sorting order will be low to high
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all"
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-0"
                  >
                    Low to High
                  </span>
                  <span
                    onClick={() => handleSortOption("HighToLow")} // sorting order will be high to low
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all"
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-1"
                  >
                    High to Low
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                onClick={() => setShowFilterOptions((prev) => !prev)} // click to show filter options/close filter options
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-400 hover:text-gray-500 focus:text-gray-700 transition-all"
                id="filter-button"
                aria-expanded={showFilterOptions}
                aria-haspopup="true"
              >
                Filter
                <DownArrowSVG />
              </button>
            </div>
            {showFilterOptions && (
              <div
                className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="filter-button"
                tabIndex="-1"
              >
                <div className="py-1" role="none">
                  {categories.map(
                    // mapping categories for checkboxes
                    (category, index) => (
                      <label
                        key={index}
                        className="inline-flex w-full cursor-pointer hover:bg-gray-50 items-center px-4 py-2 text-sm text-gray-700"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4"
                          checked={selectedCategory === category} // Check if this category is selected 'like value={}'
                          onChange={() => handleCategoryClick(category)} // Select/Deselect category
                        />
                        <span className="ml-2">{category}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex flex-1 items-center px-3.5 py-2 text-gray-400 group hover:ring-1 hover:ring-gray-300 focus-within:!ring-2 ring-inset focus-within:!ring-teal-500 rounded-md">
            <SearchSVG />
            <input
              className="block w-full appearance-none bg-transparent text-base text-gray-700 placeholder:text-gray-400 focus:outline-none placeholder:text-sm sm:text-sm sm:leading-6"
              placeholder="Find anything..."
              aria-label="Search components"
              type="text"
              aria-expanded="false"
              aria-autocomplete="list"
              value={searchInput} // search input controlling by React
              onChange={(e) => setSearchInput(e.target.value)} // search input updates with typing
              style={{ caretColor: "rgb(107, 114, 128)" }}
            />
          </div>

          <div className="flow-root">
            <a href="#" className="group -m-2 flex items-center p-2">
              <CartSVG />
              <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                {cartCount}
              </span>
              <span className="sr-only">items in cart, view bag</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
