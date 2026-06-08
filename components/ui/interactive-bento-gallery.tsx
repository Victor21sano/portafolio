"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MediaItemType {
  id: number;
  type: "image" | "video";
  title: string;
  desc: string;
  url: string;
  span: string;
}

const MediaItem = ({
  item,
  className,
  onClick
}: {
  item: MediaItemType;
  className?: string;
  onClick?: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsInView(entry.isIntersecting));
      },
      { root: null, rootMargin: "50px", threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.unobserve(video);
  }, []);

  useEffect(() => {
    let mounted = true;
    const video = videoRef.current;

    const handleVideoPlay = async () => {
      if (!video || !isInView || !mounted) return;

      try {
        if (video.readyState >= 3) {
          setIsBuffering(false);
          await video.play();
        } else {
          setIsBuffering(true);
          await new Promise((resolve) => {
            video.oncanplay = resolve;
          });
          if (mounted) {
            setIsBuffering(false);
            await video.play();
          }
        }
      } catch (error) {
        console.warn("Video playback failed:", error);
      }
    };

    if (isInView) {
      handleVideoPlay();
    } else if (video) {
      video.pause();
    }

    return () => {
      mounted = false;
      if (video) video.pause();
    };
  }, [isInView]);

  if (item.type === "video") {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          onClick={onClick}
          playsInline
          muted
          loop
          preload="metadata"
          style={{
            opacity: isBuffering ? 0.8 : 1,
            transition: "opacity 0.2s",
            transform: "translateZ(0)",
            willChange: "transform"
          }}
        >
          <source src={item.url} type="video/mp4" />
        </video>
        {isBuffering ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Image
      src={item.url}
      alt={item.title}
      fill
      unoptimized
      className={cn("cursor-pointer object-cover", className)}
      onClick={onClick}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  );
};

interface GalleryModalProps {
  selectedItem: MediaItemType;
  isOpen: boolean;
  onClose: () => void;
  setSelectedItem: (item: MediaItemType | null) => void;
  mediaItems: MediaItemType[];
}

const GalleryModal = ({ selectedItem, isOpen, onClose, setSelectedItem, mediaItems }: GalleryModalProps) => {
  const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 });

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed inset-0 z-40 min-h-screen w-full overflow-hidden bg-white/80 backdrop-blur-lg"
      >
        <div className="flex h-full flex-col">
          <div className="flex flex-1 items-center justify-center bg-zinc-50/50 p-2 sm:p-3 md:p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedItem.id}
                className="relative aspect-[16/9] h-auto max-h-[70vh] w-full max-w-[95%] overflow-hidden rounded-lg shadow-md sm:max-w-[85%] md:max-w-3xl"
                initial={{ y: 20, scale: 0.97 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 20, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
                onClick={onClose}
              >
                <MediaItem item={selectedItem} className="h-full w-full bg-zinc-900/20 object-contain" onClick={onClose} />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 md:p-4">
                  <h3 className="text-base font-semibold text-white sm:text-lg md:text-xl">{selectedItem.title}</h3>
                  <p className="mt-1 text-xs text-white/80 sm:text-sm">{selectedItem.desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.button
          className="absolute right-3 top-3 rounded-full bg-zinc-200/80 p-2 text-zinc-700 backdrop-blur-sm hover:bg-zinc-300/80"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Cerrar galería"
        >
          <X className="h-4 w-4" />
        </motion.button>
      </motion.div>

      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        initial={false}
        animate={{ x: dockPosition.x, y: dockPosition.y }}
        onDragEnd={(_, info) => {
          setDockPosition((prev) => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y
          }));
        }}
        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 touch-none"
      >
        <motion.div className="relative cursor-grab rounded-xl border border-emerald-900/20 bg-white/60 shadow-lg backdrop-blur-xl active:cursor-grabbing">
          <div className="flex items-center -space-x-2 px-3 py-2">
            {mediaItems.map((item, index) => (
              <motion.div
                key={item.id}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedItem(item);
                }}
                style={{ zIndex: selectedItem.id === item.id ? 30 : mediaItems.length - index }}
                className={cn(
                  "group relative h-8 w-8 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg sm:h-9 sm:w-9 md:h-10 md:w-10",
                  selectedItem.id === item.id ? "ring-2 ring-white/80 shadow-lg" : "hover:ring-2 hover:ring-white/40"
                )}
                initial={{ rotate: index % 2 === 0 ? -15 : 15 }}
                animate={{
                  scale: selectedItem.id === item.id ? 1.2 : 1,
                  rotate: selectedItem.id === item.id ? 0 : index % 2 === 0 ? -15 : 15,
                  y: selectedItem.id === item.id ? -8 : 0
                }}
                whileHover={{ scale: 1.3, rotate: 0, y: -10, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              >
                <MediaItem item={item} className="h-full w-full" onClick={() => setSelectedItem(item)} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

interface InteractiveBentoGalleryProps {
  mediaItems: MediaItemType[];
  title: string;
  description: string;
}

export default function InteractiveBentoGallery({ mediaItems, title, description }: InteractiveBentoGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);
  const [items, setItems] = useState(mediaItems);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-0 py-8">
      <div className="mb-8 max-w-2xl">
        <motion.h2
          className="text-3xl font-bold leading-tight text-zinc-950 sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="mt-3 text-base leading-7 text-zinc-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {description}
        </motion.p>
      </div>
      <AnimatePresence mode="wait">
        {selectedItem ? (
          <GalleryModal
            selectedItem={selectedItem}
            isOpen
            onClose={() => setSelectedItem(null)}
            setSelectedItem={setSelectedItem}
            mediaItems={items}
          />
        ) : (
          <motion.div
            className="grid auto-rows-[64px] grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
            }}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layoutId={`media-${item.id}`}
                className={cn("relative cursor-move overflow-hidden rounded-xl", item.span)}
                onClick={() => !isDragging && setSelectedItem(item)}
                variants={{
                  hidden: { y: 40, scale: 0.94, opacity: 0 },
                  visible: {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    transition: { type: "spring", stiffness: 350, damping: 25, delay: index * 0.03 }
                  }
                }}
                whileHover={{ scale: 1.02 }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={1}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(_, info) => {
                  setIsDragging(false);
                  const moveDistance = info.offset.x + info.offset.y;
                  if (Math.abs(moveDistance) > 50) {
                    const newItems = [...items];
                    const draggedItem = newItems[index];
                    const targetIndex = moveDistance > 0 ? Math.min(index + 1, items.length - 1) : Math.max(index - 1, 0);
                    newItems.splice(index, 1);
                    newItems.splice(targetIndex, 0, draggedItem);
                    setItems(newItems);
                  }
                }}
              >
                <MediaItem item={item} className="absolute inset-0 h-full w-full" onClick={() => !isDragging && setSelectedItem(item)} />
                <motion.div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                  <h3 className="relative line-clamp-1 text-sm font-semibold text-white md:text-base">{item.title}</h3>
                  <p className="relative mt-0.5 line-clamp-2 text-xs text-white/75 md:text-sm">{item.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
