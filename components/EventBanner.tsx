import Image from "next/image";

interface EventBannerProps {
  bannerUrl?: string;
  title: string;
}

export default function EventBanner({ bannerUrl, title }: EventBannerProps) {
  if (!bannerUrl) return null;

  return (
    <div className="relative h-52 w-full overflow-hidden rounded-xl">
      <Image
        src={bannerUrl}
        alt={`${title} banner`}
        fill
        sizes="(max-width: 768px) 100vw, 720px"
        className="object-cover"
      />
    </div>
  );
}
