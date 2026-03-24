import React, { useState, useEffect } from "react";
import VideoSection from "./VideoSection";
import api from "../assets/api";
import { Youtube } from "lucide-react";

const VideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Parameters added according to the backend pagination logic
        const res = await api.get('/videos?status=PUBLISHED&page=1&limit=20');

        // 🚀 THE FIX: We must use res.data.data.videos instead of res.data.data here
        setVideos(res.data?.data?.videos || []);
      } catch (err) {
        console.error("Failed to fetch videos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <Youtube className="w-8 h-8 text-red-600" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">वीडियो गैलरी</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">कोई वीडियो नहीं मिला</h2>
          <p className="text-gray-500 mt-2">जल्द ही नए वीडियो अपलोड किए जाएंगे।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {videos.map(video => (
            <VideoSection key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoPage;