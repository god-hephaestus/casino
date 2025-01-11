import React, { useEffect, useState } from "react";

const CategoryFilter = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://prod-api.bookiewiseapi.com/Games/GetCasinoCategories?lang=tr&siteId=50",
          {
            method: "POST",
            headers: {
              accept: "*/*",
              "accept-language": "en-US,en;q=0.9,tr;q=0.8",
              "content-type": "application/json; charset=UTF-8",
              origin: "https://1bahisxl.com",
              referer: "https://1bahisxl.com/",
            },
            body: JSON.stringify({}),
          }
        );
        const data = await response.json();
        if (data.Success && Array.isArray(data.Data)) {
          setCategories(data.Data); // Use the Data array
        } else {
          setCategories([]); // Handle unexpected structure
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Fallback to empty array
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    onCategorySelect(categoryId); // Pass selected category ID to parent
  };

  return (
    <div>
      <h3>Categories</h3>
      <ul>
        <li
          style={{
            cursor: "pointer",
            fontWeight: selectedCategory === "" ? "bold" : "normal",
          }}
          onClick={() => handleCategorySelect("")}
        >
          All
        </li>
        {categories.map((category) => (
          <li
            key={category.Id}
            style={{
              cursor: "pointer",
              fontWeight: selectedCategory === category.Id ? "bold" : "normal",
            }}
            onClick={() => handleCategorySelect(category.Id)}
          >
            {category.Name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;
