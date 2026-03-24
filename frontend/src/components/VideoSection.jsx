import React from 'react'

const getYoutubeEmbedUrl = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url?.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url; 
};

const VideoSection = ({ video }) => {
  if (!video) return null;
  
  const embedUrl = getYoutubeEmbedUrl(video.videoUrl);

  return (
    <div className='bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col h-full'>
        <div className='relative w-full aspect-video transition'>
            <iframe 
                className="w-full h-full" 
                src={embedUrl} 
                title={video.title} 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
            ></iframe>
        </div>
        <div className='p-4 flex flex-col flex-1'>
            <h3 className='font-bold text-gray-900 leading-snug line-clamp-2'>
                {video.title}
            </h3>
            {video.description && (
                <p className='text-sm text-gray-500 mt-2 line-clamp-2'>{video.description}</p>
            )}
            <div className="mt-auto pt-4 flex items-center justify-between">
                <p className='text-[11px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-1 rounded'>
                   {video.category?.name || "Video"}
                </p>
                <p className='text-xs text-gray-400 font-medium'>
                    {new Date(video.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    </div>
  )
}

export default VideoSection
