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
    <div className="mx-auto w-full max-w-5xl">
      {/* Section Header */}
      <div className="mb-8 text-center sm:mb-12">
        <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Watch Our Product Video
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg">
          See our product in action and discover its features
        </p>
      </div>

      {/* Video Container */}
      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-xl">
        <div className="aspect-video">
          <iframe
            src={embedUrl}
            title="Product Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="size-full"
          />
        </div>
      </div>
    </div>
  );
}
