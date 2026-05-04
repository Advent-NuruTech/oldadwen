"use client";
import React from "react";

interface Item {
  id: string;
  url: string;
  description?: string;
  title?: string;
  likes?: string[];
  createdAt?: { seconds: number; nanoseconds: number };
  userId?: string;
  userName?: string;
  userPhotoURL?: string;
}

interface ShareButtonsProps {
  item: Item;
  className?: string;
  children: React.ReactNode;
}

export default function ShareButtons({ item, className, children }: ShareButtonsProps) {
  const share = async () => {
    const shareData = {
      title: item.title || "YOUNG EVANGELISTSMINISTRY",
      text: item.description || "Check out this image from YOUNG EVANGELISTS MINISTRY!",
      url: `${window.location.origin}/image/${item.id}`,
    };

    try {
      if (navigator.canShare && navigator.canShare({ files: [] })) {
        const response = await fetch(item.url);
        const blob = await response.blob();
        const file = new File([blob], "hef-image.jpg", { type: blob.type });
        await navigator.share({ ...shareData, files: [file] });
      } else if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      } else {
        prompt("Copy this link:", shareData.url);
      }
    } catch (err) {
      console.error("Share failed", err);
      alert("Sharing not supported on this device.");
    }
  };

  return (
    <button onClick={share} className={className}>
      {children}
    </button>
  );
}