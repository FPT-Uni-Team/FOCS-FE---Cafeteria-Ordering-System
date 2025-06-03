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
