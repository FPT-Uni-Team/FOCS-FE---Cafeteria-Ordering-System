import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";

interface Notification {
  id: string | number;
  title: string;
  message: string;
}

interface NotificationSidebarProps {
  show: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export default function NotificationSidebar({
  show,
  onClose,
  notifications,
}: NotificationSidebarProps) {
  const t = useTranslations("notifications");
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: show ? "0" : "100%" }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.3 }}
      className="fixed top-0 right-0 bottom-0 h-full w-full bg-white p-4 text-black shadow-lg sm:w-80"
    >
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg font-bold">{t("title")}</h2>
        <AiOutlineClose
          size={24}
          onClick={onClose}
          className="cursor-pointer"
        />
      </div>
      <div className="mt-4 overflow-y-auto">
        <ul className="space-y-4">
          {notifications.length > 0 &&
            notifications.map((n, key) => (
              <li key={key} className="p-2 border rounded-md">
                <h3 className="font-semibold">{n.title}</h3>
                <p className="text-sm text-gray-600">{n.message}</p>
              </li>
            ))}
          <li className="p-2 border rounded-md">
            <h3 className="font-semibold">{t("welcome_title")}</h3>
            <p className="text-sm text-gray-600">{t("welcome_message")}</p>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
