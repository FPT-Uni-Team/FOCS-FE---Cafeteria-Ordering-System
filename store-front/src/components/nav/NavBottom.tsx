"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaHome, FaUser, FaShoppingCart, FaSignInAlt } from "react-icons/fa";
import { useCleanPath } from "@/utils/common/common";
import { MdLocalMall } from "react-icons/md";
import { LiaHistorySolid } from "react-icons/lia";

export default function NavBottom() {
  const { data: session } = useSession();
  const pathname = useCleanPath();
  const isAuth = !!session?.accessToken;
  const navItems = [
    {
      href: "/home-page",
      label: "Home",
      icon: <FaHome size={18} />,
    },
    {
      href: "/cart",
      label: "Cart",
      icon: <FaShoppingCart size={18} />,
    },
    {
      href: "/product-list",
      label: "Product",
      icon: <MdLocalMall size={18} />,
    },
    {
      href: "/order-history",
      label: "Order History",
      icon: <LiaHistorySolid size={18} />,
    },
    isAuth
      ? {
          href: "/profile",
          label: "Profile",
          icon: <FaUser size={18} />,
        }
      : {
          href: "/sign-in",
          label: "Sign In",
          icon: <FaSignInAlt size={18} />,
        },
  ];

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-2 rounded-full shadow-lg flex gap-6 z-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
              ${
                isActive
                  ? "bg-green-700 text-white font-semibold shadow"
                  : "text-gray-300 hover:text-white"
              }
            `}
          >
            {item.icon}
            <span className="text-sm hidden sm:inline md:inline">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
