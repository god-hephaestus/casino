"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryFilter from "./CategoryFilter";
import BrandFilter from "./BrandFilter";
import MobileBarPopup from "./MobileBarPopup";

const GameDetailsPopup = ({ game, onClose }) => {
  if (!game) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${game.ImageUrl.trim()})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px)",
          zIndex: -1,
        }}
      ></div>

      <div className="flex flex-col items-center w-screen h-screen bg-black bg-opacity-60 text-white ">
        <button
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 px-4 py-2 rounded hover:bg-opacity-70"
          onClick={onClose}
        >
          Close
        </button>
        <h2 className="mt-24 text-md font-bold mb-4 text-center">
          {game.Name}
        </h2>
        <img
          src={game.ImageUrl.trim()}
          alt={game.Name}
          className="w-[90%] rounded-lg mb-6"
        />
        <button className="px-6 py-3 w-[90%] bg-[#efbe30] text-black rounded hover:bg-[#a2802e] mb-4">
          Play Now
        </button>
        {game.HasDemo && (
          <button className="px-6 py-3 w-[90%] bg-[#007d2d] text-white rounded hover:bg-[#00491f]">
            Play Demo
          </button>
        )}
      </div>
    </div>
  );
};

const GameList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allGames, setAllGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [isMobilePopupOpen, setIsMobilePopupOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

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
        setFilteredGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchAllGames();
  }, []);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteGames");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriteGames", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const category = params.get("category") || "";
    const brand = params.get("brand") || "";
    const searchQuery = params.get("search") || "";

    setSelectedCategory(category);
    setSelectedBrands(brand ? brand.split(",") : []);
    setSearch(searchQuery);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedBrands.length > 0)
      params.set("brand", selectedBrands.join(","));
    if (search) params.set("search", search);

    const newQuery = params.toString();
    console.log("Updating URL with query parameters:", newQuery);
    router.push(`?${newQuery}`, { shallow: true });
  }, [selectedCategory, selectedBrands, search]);

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

      if (selectedBrands.length > 0) {
        filtered = filtered.filter((game) =>
          selectedBrands.includes(String(game.BrandId))
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
  }, [selectedCategory, selectedBrands, search, favorites, allGames]);

  const handleGameClick = (game) => {
    if (window.innerWidth < 1024) {
      setSelectedGame(game);
      setIsMobilePopupOpen(true);
    }
  };

  const closeMobilePopup = () => {
    setIsMobilePopupOpen(false);
    setSelectedGame(null);
  };

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
      <header className="w-full bg-[#181818] shadow sticky top-0 z-50">
        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-shrink-0 hidden lg:block">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <BrandFilter
                selectedBrand={selectedBrands}
                onBrandSelect={setSelectedBrands}
              />
            </div>
            <div className="relative w-full lg:w-[40%]">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35m-1.45-1.45A7 7 0 1116 9a7 7 0 01-7 7z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-10 py-2 bg-[#292929] text-white rounded placeholder-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <div key={game.Id} className="text-center">
                <div
                  className="relative w-full h-40 bg-center bg-cover rounded-xl overflow-hidden group"
                  style={{ backgroundImage: `url(${game.ImageUrl.trim()})` }}
                  onClick={() => handleGameClick(game)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(game.Id);
                    }}
                    className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 z-20 favorite-button group-hover:opacity-100 opacity-90"
                  >
                    <span
                      className={`star ${
                        favorites.includes(game.Id) ? "favorited" : ""
                      }`}
                    ></span>
                  </button>
                  <div className="absolute inset-0 bg-black bg-opacity-0 lg:group-hover:bg-opacity-70 transition-all duration-300 z-10"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 z-10">
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

      {isMobilePopupOpen && (
        <GameDetailsPopup game={selectedGame} onClose={closeMobilePopup} />
      )}

      <MobileBarPopup />
    </div>
  );
};

export default GameList;
