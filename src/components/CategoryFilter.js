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
          setCategories(data.Data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    onCategorySelect(categoryId);
  };

  return (
    <div>
      <ul className="flex flex-wrap justify-center gap-4 p-2">
        <li
          className={`text-lg lg:text-sm text-white h-32 w-32 lg:h-auto lg:w-auto flex justify-center items-center  cursor-pointer px-4 py-2 rounded ${
            selectedCategory === ""
              ? "bg-[#2f2f2f] border-b-8 lg:border-b-4 border-[#007d2d]"
              : "bg-[#2f2f2f] lg:bg-transparent hover:border-b-4 hover:border-[#007d2d]"
          }`}
          onClick={() => handleCategorySelect("")}
        >
          All
        </li>
        <li
          className={`text-lg lg:text-sm text-white h-32 w-32 lg:h-auto lg:w-auto flex justify-center items-center  cursor-pointer px-4 py-2 rounded ${
            selectedCategory === "favorites"
              ? "bg-[#2f2f2f] border-b-8 lg:border-b-4 border-[#007d2d]"
              : "bg-[#2f2f2f] lg:bg-transparent hover:border-b-4 hover:border-[#007d2d]"
          }`}
          onClick={() => handleCategorySelect("favorites")}
        >
          Favorites
        </li>
        {categories.map((category) => (
          <li
            key={category.Id}
            className={`text-lg lg:text-sm text-white h-32 w-32 lg:h-auto lg:w-auto flex justify-center items-center  cursor-pointer px-4 py-2 rounded ${
              selectedCategory === category.Id
                ? "bg-[#2f2f2f] border-b-8 lg:border-b-4 border-[#007d2d]"
                : "bg-[#2f2f2f] lg:bg-transparent hover:border-b-4 hover:border-[#007d2d]"
            }`}
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
