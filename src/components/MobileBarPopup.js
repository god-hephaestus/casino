"use client";

import React, { useState } from "react";
import CategoryFilter from "./CategoryFilter";

export default function MobileBarPopup() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  const openPopup = (content) => {
    if (popupContent === content && isPopupOpen) {
      closePopup();
    } else {
      setPopupContent(content);
      setIsPopupOpen(true);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupContent(null);
  };

  return (
    <div>
      <div className="hidden md:block">
        <CategoryFilter
          onCategorySelect={(categoryId) => console.log(categoryId)}
        />
      </div>

      <div className="fixed bottom-0 w-full z-[500] h-[10%] bg-[#ffffff] flex justify-between items-center md:hidden">
        <div
          className={`flex-1 flex flex-col h-full items-center justify-center cursor-pointer ${
            isPopupOpen && popupContent === "new"
              ? "bg-[#007d2d] text-white"
              : "text-black"
          }`}
          onClick={() => openPopup("new")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12H9m4-4H9m10 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V8a2 2 0 012-2h3l2-2h4a2 2 0 012 2v2"
            />
          </svg>
          New Games
        </div>
        <div
          className={`flex-1 flex flex-col h-full items-center justify-center cursor-pointer ${
            isPopupOpen && popupContent === "category"
              ? "bg-[#007d2d] text-white"
              : "text-black"
          }`}
          onClick={() => openPopup("category")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h11M9 21V3M17 16l4-4m0 0l-4-4m4 4H9"
            />
          </svg>
          Category
        </div>
        <div
          className={`flex-1 flex flex-col h-full items-center justify-center cursor-pointer ${
            isPopupOpen && popupContent === "my"
              ? "bg-[#007d2d] text-white"
              : "text-black"
          }`}
          onClick={() => openPopup("my")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A5.5 5.5 0 1118.879 6.196M15 12h.01M21 12h.01M3 12h.01"
            />
          </svg>
          My Games
        </div>
      </div>

      {isPopupOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closePopup}
        >
          <div
            className="bg-white rounded-lg p-6 w-screen h-4/5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-black font-bold"
              onClick={closePopup}
            >
              ✖
            </button>
            <div>
              {popupContent === "category" && (
                <CategoryFilter
                  onCategorySelect={(categoryId) => console.log(categoryId)}
                />
              )}
              {popupContent === "new" && (
                <div>New Games content goes here...</div>
              )}
              {popupContent === "my" && (
                <div>My Games content goes here...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
