"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import { ImageType } from "@/types/menuItem";

interface ProductImagesProps {
  images: string[] | ImageType[] | string;
}

export default function ImageSlider({ images }: ProductImagesProps) {
  let imageList: string[] = [];
  if (Array.isArray(images)) {
    if (images.length > 0 && typeof images[0] === "object") {
      const imgObjects = images as ImageType[];
      imageList = [...imgObjects]
        .sort((a, b) => (b.is_main ? 1 : 0) - (a.is_main ? 1 : 0))
        .map((img) => img.url);
    } else {
      imageList = images as string[];
    }
  } else if (typeof images === "string") {
    imageList = [images];
  }

  return (
    <>
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="h-[250px] mb-4 overflow-hidden"
      >
        {imageList.map((imgUrl, index) => (
          <SwiperSlide key={index}>
            <Image
              src={imgUrl || "/img/profile/default-avatar.jpg"}
              alt={`product-image-${index}`}
              width={500}
              height={250}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: #d1d5db;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background-color: #434343;
        }
      `}</style>
    </>
  );
}
