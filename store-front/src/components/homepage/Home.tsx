"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { makeHref } from "@/utils/common/common";
import { useEffect, useState } from "react";
import productService from "@/services/productService";

export interface ICategory {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

interface IHomeProps {
  categories: ICategory[];
}

export default function Home({ categories }: IHomeProps) {
  const t = useTranslations("homepage");
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mostOrderProducts, setMostOrderProducts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [basedOnHistoryProducts, setBasedOnHistoryProducts] = useState<any[]>(
    []
  );
  const [loadingMostOrder, setLoadingMostOrder] = useState(true);
  const [loadingBasedOnHistory, setLoadingBasedOnHistory] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resMostOrder = await productService.mostOrder();
        setMostOrderProducts(resMostOrder.data ?? []);
      } catch (e) {
        console.error("Error fetch mostOrder:", e);
      } finally {
        setLoadingMostOrder(false);
      }

      try {
        const resBasedOnHistory = await productService.basedOnHistory();
        setBasedOnHistoryProducts(resBasedOnHistory.data ?? []);
      } catch (e) {
        console.error("Error fetch basedOnHistory:", e);
      } finally {
        setLoadingBasedOnHistory(false);
      }
    };
    fetchData();
  }, []);

  const handleBuyNowClick = () => {
    router.push(makeHref("product-list"));
  };
  const handleNavigate = (path: string) => {
    router.push(makeHref(path));
  };

  const ProductSkeleton = () => (
    <div className="shadow-md border-gray-200 rounded-2xl flex flex-col items-center animate-pulse p-4">
      <div className="bg-gray-300 rounded-full w-40 h-40 mb-3"></div>
      <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-16"></div>
    </div>
  );

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
          style={{ paddingBottom: "4px" }}
          observer={true}
          observeParents={true}
        >
          {loadingMostOrder
            ? [...Array(3)].map((_, idx) => (
                <SwiperSlide key={idx}>
                  <ProductSkeleton />
                </SwiperSlide>
              ))
            : mostOrderProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="shadow-md border-gray-600 rounded-2xl flex flex-col items-center">
                    <Image
                      src={product.image}
                      alt={product.menu_item_name}
                      className="object-cover rounded-full w-40 h-40"
                      priority
                      height={80}
                      width={80}
                    />
                    <div className="p-3 text-black text-center">
                      <h3
                        className="text-lg font-semibold"
                        onClick={() => {
                          handleNavigate(
                            `product-detail/${product.menu_item_id}`
                          );
                        }}
                      >
                        {product.menu_item_name}
                      </h3>
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
          observer={true}
          observeParents={true}
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
          style={{ paddingBottom: "4px" }}
          observer={true}
          observeParents={true}
        >
          {loadingBasedOnHistory
            ? [...Array(3)].map((_, idx) => (
                <SwiperSlide key={idx}>
                  <ProductSkeleton />
                </SwiperSlide>
              ))
            : basedOnHistoryProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="shadow-md border-gray-600 rounded-2xl flex flex-col items-center">
                    <Image
                      src={product.image}
                      alt={product.menu_item_name}
                      className="object-cover rounded-full w-40 h-40"
                      priority
                      height={80}
                      width={80}
                    />
                    <div className="p-3 text-black text-center">
                      <h3
                        className="text-lg font-semibold"
                        onClick={() => {
                          handleNavigate(
                            `product-detail/${product.menu_item_id}`
                          );
                        }}
                      >
                        {product.menu_item_name}
                      </h3>
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
