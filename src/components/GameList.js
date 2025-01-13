"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryFilter from "./CategoryFilter";
import BrandFilter from "./BrandFilter";

const GameList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allGames, setAllGames] = useState([]); // Store all games initially
  const [filteredGames, setFilteredGames] = useState([]); // Store filtered games
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  // Fetch all games on initial load
  useEffect(() => {
    const fetchAllGames = async () => {
      console.log("Fetching all games from the API...");
      try {
        const response = await fetch(
          "https://prod-api.bookiewiseapi.com/Games/GamesByBrand?lang=tr&siteId=50",
          {
            method: "POST",
            headers: {
              Referer: "https://1bahisxl.com/",
              "User-Agent":
                "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
              "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
              GameType: "slot_game",
              Mobile: true,
              Page: 0,
              BrandId: null,
              CategoryId: null,
            }),
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("All games fetched successfully:", data);
        setAllGames(data);
        setFilteredGames(data); // Initialize filtered games with all data
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchAllGames();
  }, []);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteGames");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favoriteGames", JSON.stringify(favorites));
  }, [favorites]);

  // Parse query parameters and update filters
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const category = params.get("category") || "";
    const brand = params.get("brand") || "";
    const searchQuery = params.get("search") || "";

    setSelectedCategory(category);
    setSelectedBrand(brand);
    setSearch(searchQuery);
  }, [searchParams]);

  // Update URL dynamically (shallow routing) when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedBrand) params.set("brand", selectedBrand);
    if (search) params.set("search", search);

    const newQuery = params.toString();
    console.log("Updating URL with query parameters:", newQuery);
    router.push(`?${newQuery}`, { shallow: true });
  }, [selectedCategory, selectedBrand, search]);

  // Filter games based on the current filters
  useEffect(() => {
    const filterGames = () => {
      console.log("Filtering games based on query parameters...");
      let filtered = [...allGames];

      if (selectedCategory === "favorites") {
        filtered = filtered.filter((game) => favorites.includes(game.Id));
      } else if (selectedCategory) {
        filtered = filtered.filter(
          (game) => game.CategoryId === parseInt(selectedCategory)
        );
      }

      if (selectedBrand) {
        filtered = filtered.filter(
          (game) => game.BrandId === parseInt(selectedBrand)
        );
      }

      if (search) {
        filtered = filtered.filter((game) =>
          game.Name.toLowerCase().includes(search.toLowerCase())
        );
      }

      console.log("Filtered games:", filtered);
      setFilteredGames(filtered);
    };

    filterGames();
  }, [selectedCategory, selectedBrand, search, favorites, allGames]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const toggleFavorite = (gameId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(gameId)) {
        return prevFavorites.filter((id) => id !== gameId);
      } else {
        return [...prevFavorites, gameId];
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#f2f2f2]">
      {/* Header Section */}
      <header className="w-full bg-white shadow sticky top-0 z-50">
        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
          {/* Category Filter (Left) */}
          <div className="flex-shrink-0">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>

          {/* Brand Filter and Search Input (Right) */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Provider Filter */}
            <div className="relative">
              <BrandFilter
                selectedBrand={selectedBrand}
                onBrandSelect={setSelectedBrand}
              />
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={handleSearchChange}
              className="w-full md:w-[40%] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <div key={game.Id} className="text-center">
                <div
                  className="relative w-full h-40 bg-center bg-cover rounded-xl overflow-hidden group"
                  style={{ backgroundImage: `url(${game.ImageUrl.trim()})` }}
                >
                  <button
                    onClick={() => toggleFavorite(game.Id)}
                    className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 z-20 favorite-button group-hover:opacity-100 opacity-90"
                  >
                    <span
                      className={`star ${
                        favorites.includes(game.Id) ? "favorited" : ""
                      }`}
                    ></span>
                  </button>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 z-10"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <p className="font-semibold text-xs">{game.BrandName}</p>
                    <div className="my-2"></div>
                    <button className="px-4 py-2 bg-[#efbe30] min-w-[50%] rounded text-black flex items-center justify-center gap-2 hover:bg-[#a2802e]">
                      <span className="text-xs font-semibold">Play Now</span>
                    </button>
                    {game.HasDemo && (
                      <button className="mt-2 px-4 py-2 bg-[#007d2d] min-w-[50%] text-xs rounded text-white flex items-center justify-center gap-2 hover:bg-[#00491f]">
                        Play Demo
                      </button>
                    )}
                  </div>
                </div>
                <h3 className="mt-2 text-sm font-semibold">{game.Name}</h3>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center">No games found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default GameList;
