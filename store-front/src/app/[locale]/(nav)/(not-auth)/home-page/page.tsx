import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Món chính",
    icon: "https://cdn-icons-png.flaticon.com/512/3595/3595455.png",
  },
  {
    name: "Đồ uống",
    icon: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  },
  {
    name: "Tráng miệng",
    icon: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png",
  },
];

const featuredItems = [
  {
    name: "Gà rán giòn cay",
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
    price: "59.000đ",
  },
  {
    name: "Trà đào cam sả",
    image:
      "https://images.unsplash.com/photo-1571076778933-55ecdc0d470e?auto=format&fit=crop&w=800&q=80",
    price: "39.000đ",
  },
  {
    name: "Bánh Flan caramel",
    image:
      "https://images.unsplash.com/photo-1599785209707-28b9b927b34e?auto=format&fit=crop&w=800&q=80",
    price: "25.000đ",
  },
  {
    name: "Bánh Flan caramel",
    image:
      "https://images.unsplash.com/photo-1599785209707-28b9b927b34e?auto=format&fit=crop&w=800&q=80",
    price: "25.000đ",
  },
  {
    name: "Bánh Flan caramel",
    image:
      "https://images.unsplash.com/photo-1599785209707-28b9b927b34e?auto=format&fit=crop&w=800&q=80",
    price: "25.000đ",
  },
];

export default function HomePage() {
  const t = useTranslations("home-page");
  return (
    <div className="text-black">
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">{t("category_title")}</h2>
        <div className="flex justify-between items-center gap-2">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center shadow">
                <Image
                  src={cat.icon}
                  alt={cat.name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-sm mt-1">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2">
          {t("featured_dishes_title")}
        </h2>
        <div className="space-y-4">
          {featuredItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-3"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-sm">{item.name}</h3>
                <p className="text-orange-600 font-semibold">{item.price}</p>
              </div>
              <Link
                href="/cart"
                className="bg-orange-500 text-white text-sm px-3 py-1 rounded-lg"
              >
                {t("order_button")}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
