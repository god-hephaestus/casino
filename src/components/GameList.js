"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For client-side routing
import CategoryFilter from "./CategoryFilter";
import BrandFilter from "./BrandFilter";

const GameList = ({ slug }) => {
  const router = useRouter();

  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [search, setSearch] = useState("");
  const [hasDemo, setHasDemo] = useState(null);

  // Handle slug and initialize filters
  useEffect(() => {
    if (!slug || slug.length === 0) {
      // No slug means we're on the root route
      setSelectedCategory("");
      setSelectedBrand("");
      return;
    }

    const categorySegment = slug.find((segment) =>
      segment.startsWith("category-")
    );
    const brandSegment = slug.find((segment) => segment.startsWith("brand-"));

    if (categorySegment) {
      const category = categorySegment.replace("category-", "");
      setSelectedCategory(category);
    }

    if (brandSegment) {
      const brand = brandSegment.replace("brand-", "");
      setSelectedBrand(brand);
    }
  }, [slug]);

  // Update URL dynamically without navigation
  const updateURL = () => {
    const newPath = [
      selectedCategory && `category-${selectedCategory}`,
      selectedBrand && `brand-${selectedBrand}`,
    ]
      .filter(Boolean)
      .join("/");

    router.push(`/${newPath}`, { shallow: true });
  };

  // Update filters and URL when category/brand changes
  useEffect(() => {
    updateURL();
  }, [selectedCategory, selectedBrand]);

  // Fetch games when category or brand changes
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
              BrandId: selectedBrand || null,
              CategoryId: selectedCategory || null,
            }),
          }
        );
        const data = await response.json();
        setGames(data);
        setFilteredGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, [selectedCategory, selectedBrand]);

  // Client-side filtering
  useEffect(() => {
    let updatedGames = [...games];

    if (search) {
      updatedGames = updatedGames.filter((game) =>
        game.Name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (hasDemo !== null) {
      updatedGames = updatedGames.filter((game) => game.HasDemo === hasDemo);
    }

    setFilteredGames(updatedGames);
  }, [search, hasDemo, games]);

  return (
    <div>
      <CategoryFilter onCategorySelect={setSelectedCategory} />
      <BrandFilter onBrandSelect={setSelectedBrand} />

      <div>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

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
