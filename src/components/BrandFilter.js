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
      <h3>Brands</h3>
      <select
        value={selectedBrand}
        onChange={(e) => handleBrandSelect(e.target.value)}
      >
        <option value="">All Brands</option>
        {brands.map((brand) => (
          <option key={brand.Id} value={brand.Id}>
            {brand.Name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BrandFilter;
