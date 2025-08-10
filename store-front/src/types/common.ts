export type IAuthenticationProps = {
  params: Promise<{ locale: string }>;
};

export interface ICenteredLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export interface IRootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export interface ListPageParams {
  page: number;
  page_size: number;
  search_by?: string;
  search_value?: string;
  sort_by?: string;
  sort_order?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: Record<string, any>;
}
export type ProductListParams = {
  page: number;
  page_size: number;
  search_by?: string;
  search_value?: string;
  sort_by?: string;
  sort_order?: string;
  filters?: Record<string, string>;
};

export const defaultParams = (page_size = 10, page = 1) => ({
  page,
  page_size,
  search_by: "",
  search_value: "",
  sort_by: "",
  sort_order: "",
  filters: {},
});
