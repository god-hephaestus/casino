import React, { useEffect, useState } from "react";

const BrandFilter = ({ onBrandSelect }) => {
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Desktop dropdown
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Mobile popup
  const [searchQuery, setSearchQuery] = useState("");

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
        if (data && Array.isArray(data)) {
          setBrands(data);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandToggle = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handleApplyFilters = () => {
    setIsPopupOpen(false);
    onBrandSelect(selectedBrands);
  };

  const filteredBrands = brands.filter((brand) =>
    brand.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    onBrandSelect(selectedBrands);
  }, [selectedBrands, onBrandSelect]);

  return (
    <div>
      <div className="hidden lg:block relative w-[300px] mx-auto">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full px-4 py-2 text-white text-left bg-[#2f2f2f] hover:bg-black focus:outline-none rounded transition-all"
        >
          {selectedBrands.length > 0
            ? `${selectedBrands.length} selected`
            : "All Brands"}
          <span
            className={`float-right transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        <div
          className={`absolute z-10 w-full bg-white rounded shadow-lg overflow-hidden transition-all duration-300 ${
            isDropdownOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-gray-800 bg-gray-100 focus:outline-none"
          />

          <ul className="max-h-[300px] overflow-y-auto ">
            {filteredBrands.map((brand) => (
              <li
                key={brand.Id}
                className={`px-4 py-2 cursor-pointer flex items-center gap-2 ${
                  selectedBrands.includes(brand.Id)
                    ? "bg-[#2f2f2f] text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => handleBrandToggle(brand.Id)}
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.Id)}
                  readOnly
                  className="w-4 h-4 accent-black"
                />
                {brand.Name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="lg:hidden">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#007d2d] text-white rounded-md text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414V19a1 1 0 01-.293.707l-3 3A1 1 0 018 21v-6.586L1.293 6.707A1 1 0 011 6V4a1 1 0 011-1z"
            />
          </svg>
          Filter
        </button>

        {isPopupOpen && (
          <div className="fixed inset-0 w-screen z-50 flex flex-col items-center justify-end bg-black bg-opacity-50">
            <div className="w-full bg-white h-[80%] overflow-y-scroll rounded-t-lg">
              {/* Sticky Header */}
              <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-4 py-3 border-b">
                <h3 className="text-lg font-semibold">
                  Filter by Brands{" "}
                  {selectedBrands.length > 0 && (
                    <span className="text-sm text-gray-600">
                      ({selectedBrands.length})
                    </span>
                  )}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsPopupOpen(false)}
                    className="px-4 py-2 bg-gray-300 font-semibold rounded-md text-black"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="px-4 py-2 bg-[#efbe30] font-semibold text-black rounded-md"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="p-4 grid grid-cols-4 gap-4">
                {brands.map((brand) => (
                  <div
                    key={brand.Id}
                    className={`p-2 rounded-3xl border cursor-pointer text-sm ${
                      selectedBrands.includes(brand.Id)
                        ? "bg-[#007d2d] text-white border-[#00491f]"
                        : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                    }`}
                    onClick={() => handleBrandToggle(brand.Id)}
                  >
                    {brand.Name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandFilter;
