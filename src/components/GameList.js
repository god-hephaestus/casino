"use client";
import React, { useState, useEffect } from "react";
import CategoryFilter from "./CategoryFilter";

const GameList = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [hasDemo, setHasDemo] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
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
              CategoryId: selectedCategory || null, // Include selected category
            }),
          }
        );
        const data = await response.json();
        console.log("Games API Response:", data); // Debug log
        setGames(data); // Update games list
        setFilteredGames(data); // Initialize filtered games
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, [selectedCategory]); // Re-fetch games when category changes

  useEffect(() => {
    let updatedGames = [...games];

    if (search) {
      updatedGames = updatedGames.filter((game) =>
        game.Name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedBrand) {
      updatedGames = updatedGames.filter(
        (game) => game.BrandName.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    if (hasDemo !== null) {
      updatedGames = updatedGames.filter((game) => game.HasDemo === hasDemo);
    }

    setFilteredGames(updatedGames);
  }, [search, selectedBrand, hasDemo, games]);

  return (
    <div>
      <CategoryFilter onCategorySelect={setSelectedCategory} />

      <div>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          onChange={(e) => setSelectedBrand(e.target.value)}
          value={selectedBrand}
        >
          <option value="">All Providers</option>
          {Array.from(new Set(games.map((game) => game.BrandName))).map(
            (brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            )
          )}
        </select>

        <button onClick={() => setHasDemo(true)}>Has Demo</button>
        <button onClick={() => setHasDemo(false)}>No Demo</button>
        <button onClick={() => setHasDemo(null)}>All</button>
      </div>

      <div className="game-grid">
        {filteredGames.map((game) => (
          <div key={game.Id} className="game-card">
            <img src={game.ImageUrl.trim()} alt={game.Name} />
            <h3>{game.Name}</h3>
            <p>Provider: {game.BrandName}</p>
            {game.HasDemo && <button>Play Demo</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameList;
