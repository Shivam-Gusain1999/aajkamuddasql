import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";


const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [news, setNews] = useState([]);
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  useEffect(() => {
    if (!query) return;

    const fetchSearchNews = async () => {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=${query}&language=hi&sortBy=publishedAt&apiKey=${API_KEY}`
        );
        const data = await res.json();
        setNews(data.articles || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSearchNews();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">
        खोज परिणाम: <span className="text-orange-500">{query}</span>
      </h2>

      {news.length === 0 && (
        <p className="text-gray-500">कोई समाचार नहीं मिला</p>
      )}

      <div className="space-y-4">
        {news.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(`/news/${index}`, { state: item })}
            className="flex gap-4 bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md"
          >
            {item.urlToImage && (
              <img
                src={item.urlToImage}
                className="w-40 h-28 object-cover rounded"
              />
            )}
            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage
