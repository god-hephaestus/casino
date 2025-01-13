import React, { useEffect, useState } from "react";

const BrandFilter = ({ onBrandSelect }) => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(
          "https://prod-api.bookiewiseapi.com/Games/GetBrandsV2?lang=tr&siteId=50",
          {
            method: "POST",
            headers: {
              accept: "*/*",
              "accept-language": "en-US,en;q=0.9,tr;q=0.8",
              "content-type": "application/json; charset=UTF-8",
              origin: "https://1bahisxl.com",
              referer: "https://1bahisxl.com/",
            },
            body: JSON.stringify({ GameType: "slot_game" }),
          }
        );
        const data = await response.json();
        console.log("Brands API Response:", data); // Debug log
        if (data && Array.isArray(data)) {
          setBrands(data);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandSelect = (brandId) => {
    setSelectedBrand(brandId);
    onBrandSelect(brandId); // Pass selected brand ID to parent
  };

  return (
    <div>
      <h3 className="text-black h-[30px] mt-[20px] mx-[5px] pl-[6px] text-[1.1rem] font-semibold">
        Brands
      </h3>
      <ul>
        <li
          className={`text-sm cursor-pointer p-2 rounded ${
            selectedBrand === ""
              ? "bg-[#2f2f2f] text-white border-l-4 border-[#007d2d]"
              : "text-black hover:bg-gray-200"
          }`}
          onClick={() => handleBrandSelect("")}
        >
          All Brands
        </li>
        {brands.map((brand) => (
          <li
            key={brand.Id}
            className={`text-sm cursor-pointer p-2 rounded ${
              selectedBrand === brand.Id
                ? "bg-[#2f2f2f] text-white border-l-4 border-[#007d2d]"
                : "text-black hover:bg-gray-200"
            }`}
            onClick={() => handleBrandSelect(brand.Id)}
          >
            {brand.Name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrandFilter;
