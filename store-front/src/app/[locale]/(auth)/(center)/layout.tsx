import { ICenteredLayoutProps } from "@/types/common";
import { setRequestLocale } from "next-intl/server";

export default async function CenteredLayout(props: ICenteredLayoutProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return <div>{props.children}</div>;
}
