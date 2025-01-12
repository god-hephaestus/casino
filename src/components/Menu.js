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
        console.log("Menu API Response:", data);
        if (Array.isArray(data)) {
          setMenuItems(data.filter((item) => item.IsActive));
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenu();
  }, []);

  const renderMenu = (menu, parentKey = "") => {
    // Generate a fully unique key for each menu item
    const uniqueKey = `${parentKey}-${menu.MenuKey}-${
      menu.UrlRoute || menu.OrderIndex || "default"
    }`;

    return (
      <li key={uniqueKey}>
        <a
          href={menu.IsUnderMaintenance ? null : menu.UrlRoute || "#"}
          className={`${
            menu.IsUnderMaintenance ? "text-gray-500 cursor-not-allowed" : ""
          } flex items-center`}
          title={
            menu.IsUnderMaintenance ? "This section is under maintenance" : ""
          }
        >
          {menu.MenuIcon && <i className={`${menu.MenuIcon} mr-2`}></i>}
          <span>{menu.MenuText}</span>
          {menu.IsNew && <span className="ml-2 text-red-500 text-xs">NEW</span>}
        </a>

        {menu.Children && menu.Children.length > 0 && (
          <ul className="pl-4">
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
      <ul>
        {menuItems.map((menu) => (
          <li
            key={menu.MenuKey}
            className={menu.IsHiddenOnMobile ? "hidden lg:block" : ""}
          >
            <ul>{renderMenu(menu)}</ul>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
