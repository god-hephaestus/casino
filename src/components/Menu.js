"use client";

import React, { useEffect, useState } from "react";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(
          "https://prod-api.bookiewiseapi.com/Site/GetMenu?lang=tr&siteId=50",
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
        console.log("Menu API Response:", data); // Debug log
        if (Array.isArray(data)) {
          setMenuItems(data.filter((item) => item.IsActive)); // Only include active menus
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenu();
  }, []);

  const renderMenu = (menu, parentKey = "") => {
    // Generate a fully unique key by combining MenuKey, UrlRoute, and OrderIndex
    const uniqueKey = `${parentKey}-${menu.MenuKey}-${
      menu.UrlRoute || menu.OrderIndex || "default"
    }`;

    return (
      <li key={uniqueKey} style={{ paddingLeft: "20px" }}>
        <a href={menu.UrlRoute || "#"}>
          {menu.MenuIcon && <i className={menu.MenuIcon}></i>} {menu.MenuText}
        </a>
        {menu.Children && menu.Children.length > 0 && (
          <ul>
            {menu.Children.filter((child) => child.IsActive).map((child) =>
              renderMenu(child, uniqueKey)
            )}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav>
      <ul>{menuItems.map((menu) => renderMenu(menu))}</ul>
    </nav>
  );
};

export default Menu;
