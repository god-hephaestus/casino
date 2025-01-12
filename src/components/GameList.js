"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // For routing and query params
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

      if (selectedCategory) {
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
  }, [selectedCategory, selectedBrand, search, allGames]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <CategoryFilter onCategorySelect={setSelectedCategory} />
      <BrandFilter onBrandSelect={setSelectedBrand} />

      <div>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="game-grid">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <div key={game.Id} className="game-card">
              <img src={game.ImageUrl.trim()} alt={game.Name} />
              <h3>{game.Name}</h3>
              <p>Provider: {game.BrandName}</p>
              {game.HasDemo && <button>Play Demo</button>}
            </div>
          ))
        ) : (
          <p>No games found.</p>
        )}
      </div>
    </div>
  );
};

export default GameList;
