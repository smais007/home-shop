import type { Video } from "@/types/database";

interface VideoSectionProps {
  video: Video;
}

function getYouTubeEmbedUrl(url: string): string {
  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }

  // If already an embed URL, return as is
  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  return url;
}

export function VideoSection({ video }: VideoSectionProps) {
  const embedUrl = getYouTubeEmbedUrl(video.youtube_url);

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-6 text-center text-3xl font-bold">Watch Our Product Video</h2>
      <div className="aspect-video overflow-hidden rounded-lg shadow-lg">
        <iframe
          src={embedUrl}
          title="Product Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full"
        />
      </div>
    </div>
  );
}
