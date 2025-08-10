"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const featuredProducts = [
  {
    id: 1,
    name: "Sản phẩm 1",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    price: "500,000₫",
  },
  {
    id: 2,
    name: "Sản phẩm 2",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    price: "750,000₫",
  },
  {
    id: 3,
    name: "Sản phẩm 3",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    price: "300,000₫",
  },
];

const categories = [
  {
    id: 1,
    name: "Áo thun",
    icon: "https://img.icons8.com/ios-filled/50/000000/t-shirt.png",
  },
  {
    id: 2,
    name: "Giày dép",
    icon: "https://img.icons8.com/ios-filled/50/000000/shoes.png",
  },
  {
    id: 3,
    name: "Phụ kiện",
    icon: "https://img.icons8.com/ios-filled/50/000000/wristwatch.png",
  },
  {
    id: 4,
    name: "Phụ kiện",
    icon: "https://img.icons8.com/ios-filled/50/000000/wristwatch.png",
  },
  {
    id: 5,
    name: "Phụ kiện",
    icon: "https://img.icons8.com/ios-filled/50/000000/wristwatch.png",
  },
];

export default function Home() {
  const t = useTranslations("homepage");
  const router = useRouter();
  const handleBuyNowClick = () => {
    router.push("/product-list");
  };

  return (
    <div className="bg-white text-gray-900 ">
      <header className="mb-6 p-4">
        <h1 className="text-2xl font-bold text-center">
          {t("welcomeMessage")}
        </h1>
        <p className="text-center text-gray-600 mt-2 text-sm">
          {t("discoverProducts")}
        </p>
      </header>

      <section className="mb-8">
        <h2 className="text-md font-semibold mb-4">{t("featuredProducts")}</h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1.5}
          style={{
            paddingBottom: "4px",
          }}
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="shadow-md border-gray-600 rounded-2xl flex flex-col items-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="object-cover rounded-full w-40 h-40"
                  priority
                  height={80}
                  width={80}
                />
                <div className="p-3 text-black text-center">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm">{product.price}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="mb-8">
        <h2 className="text-md font-semibold mb-4">{t("categories")}</h2>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={"auto"}
          loop={true}
          autoplay={{ delay: 1000, disableOnInteraction: false }}
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.id} style={{ width: "auto" }}>
              <div className="bg-green-800 text-white rounded-4xl px-6 py-3 cursor-pointer select-none hover:bg-green-600 transition">
                {cat.name}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="mb-8">
        <h2 className="text-md font-semibold mb-4">{t("baseOnUse")}</h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1.5}
          style={{
            paddingBottom: "4px",
          }}
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="shadow-md border-gray-600 rounded-2xl flex flex-col items-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="object-cover rounded-full w-40 h-40"
                  priority
                  height={80}
                  width={80}
                />
                <div className="p-3 text-black text-center">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm">{product.price}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      <section className="text-center pb-4">
        <button
          onClick={handleBuyNowClick}
          className="bg-green-800 text-white font-bold py-3 px-6 rounded-full shadow-lg"
        >
          {t("buy_now")}
        </button>
      </section>
    </div>
  );
}
