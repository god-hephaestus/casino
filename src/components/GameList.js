"use client";

import React, { useState, useEffect } from "react";

const GameList = () => {
  const [games, setGames] = useState([]);

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
            }),
          }
        );
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="game-grid">
      {games.map((game) => (
        <div key={game.Id} className="game-card">
          <img src={game.ImageUrl.trim()} alt={game.Name} />
          <h3>{game.Name}</h3>
          <p>Provider: {game.BrandName}</p>
          {game.HasDemo && <button>Play Demo</button>}
        </div>
      ))}
    </div>
  );
};

export default GameList;
