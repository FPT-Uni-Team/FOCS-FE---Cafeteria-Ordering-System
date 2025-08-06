"use client";
import { Product } from "@/types/menuItem";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CiShoppingCart } from "react-icons/ci";
import ProductModalCart from "./ProductModalCart";
import { useAppSelector } from "@/hooks/redux";
import { SubmitPayload } from "@/types/cart";
import axiosClient from "@/api/axiosClient";
import productService from "@/services/productService";
import { defaultParams, ProductListParams } from "@/types/common";
import ProductSkeleton from "../common/ProductSkeleton";
import { useFilter } from "@/context/FilterContext";
import { useRouter } from "next/navigation";
import usePrevNavigate from "@/hooks/usePrevNavigate";

export default function ProductList() {
  const [showSlider, setShowSlider] = useState(false);
  const { selectedPrice, selectedCategories } = useFilter();
  const { searchGlobalData: searchText, searchTrigger } = useAppSelector(
    (state) => state.common
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { actorId, tableId } = useAppSelector((state) => state.common);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const trigger = usePrevNavigate();

  const fetchProduct = async ({
    pageNumber = 1,
    params,
  }: {
    pageNumber?: number;
    params?: ProductListParams;
  }) => {
    const paramsFilter: ProductListParams = {
      ...(params ?? defaultParams(10, pageNumber)),
      page: pageNumber,
      search_by: "name",
      sort_by: "price",
    };

    try {
      if (pageNumber === 1) setIsLoading(true);
      else setIsFetchingMore(true);

      const res = await productService.list(paramsFilter);
      const newItems = res.data.items || [];
      const totalCount = res.data.total_count || 0;

      setProducts((prev) =>
        pageNumber === 1 ? newItems : [...prev, ...newItems]
      );
      const currentTotal =
        pageNumber === 1 ? newItems.length : products.length + newItems.length;
      setHasMore(currentTotal < totalCount);
    } catch {
      throw new Error("");
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleSubmit = async (product: SubmitPayload) => {
    try {
      const data = {
        menu_item_id: product.menu_item_id,
        variants: product.variant_ids.map((id) => ({
          variant_id: id,
          quantity: 1,
        })),
        quantity: product.quantity,
        note: product.note,
        actorId,
        tableId,
      };
      await axiosClient.post("/api/cart/add", data);
    } catch {
      throw new Error("");
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(1);
    const params: ProductListParams = {
      ...defaultParams(10, 1),
      search_value: searchText || "",
      sort_order: selectedPrice || "",
      ...(selectedCategories.length > 0 && {
        filters: {
          category: selectedCategories.join(","),
        },
      }),
    };
    fetchProduct({ pageNumber: 1, params });
  }, [searchTrigger]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, isFetchingMore]);

  useEffect(() => {
    if (page === 1) return;
    const params: ProductListParams = {
      ...defaultParams(10, page),
      search_value: searchText || "",
      sort_order: selectedPrice || "",
      ...(selectedCategories.length > 0 && {
        filters: {
          categories: selectedCategories.join(","),
        },
      }),
    };
    fetchProduct({ pageNumber: page, params });
  }, [page]);

  return (
    <>
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="w-28 h-28 flex-shrink-0 p-2">
                <Image
                  src={
                    (product?.images as string) ||
                    "/img/profile/default-avatar.jpg"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover rounded-md"
                  width={80}
                  height={80}
                  loading="lazy"
                />
              </div>
              <div className="flex p-2 relative w-full">
                <div className="flex flex-col justify-between">
                  <div>
                    <h2
                      className="text-lg font-semibold text-gray-800"
                      onClick={() => {
                        trigger();
                        router.push(`/product-detail/${product.id}`);
                      }}
                    >
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {product.categories?.map((cat) => cat.name).join(", ")}
                    </p>
                  </div>
                  <p className="text-green-800 text-sm font-semibold">
                    {product?.base_price || 0} VND
                  </p>
                </div>
                <button
                  className="absolute bottom-4 right-4 text-white bg-green-800 px-[10px] py-1 rounded-xl"
                  title="Add to cart"
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowSlider(true);
                  }}
                >
                  <CiShoppingCart size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {!isLoading && (selectedProduct || products[0]) && (
        <ProductModalCart
          product={selectedProduct || products[0]}
          show={showSlider}
          onClose={() => setShowSlider(false)}
          onSubmit={handleSubmit}
        />
      )}

      {isFetchingMore && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <ProductSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}

      {hasMore && <div ref={loaderRef} />}
    </>
  );
}
