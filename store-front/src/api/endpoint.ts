const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const API_BASE_URL_HUB = process.env.NEXT_PUBLIC_API_BASE_URL_HUB || "";

const endpoints = {
  promotion: {
    list: () => `${API_BASE_URL}/admin/promotion/list`,
    create: () => `${API_BASE_URL}/admin/promotion`,
    detail: (params: string) => `${API_BASE_URL}/admin/promotion/${params}`,
    update: (params: string) => `${API_BASE_URL}/admin/promotion/${params}`,
    change: (action: string, id: string) =>
      `${API_BASE_URL}/admin/promotion/${action}/${id}`,
  },
  menuItem: {
    list: () => `${API_BASE_URL}/me/menu-item`,
    listByIds: () => `${API_BASE_URL}/me/menu-item/ids`,
    detail: (params: string) => `${API_BASE_URL}/me/menu-item/${params}`,
    update: (params: string) => `${API_BASE_URL}/admin/menu-item/${params}`,
    images: (params: string) =>
      `${API_BASE_URL}/admin/menu-item/${params}/images`,
    variantGroups: (params: string) =>
      `${API_BASE_URL}/me/menu-item/${params}/variant-groups`,
    menuItemCategory: (params: string) =>
      `${API_BASE_URL}/me/menu-item/menu-item/${params}/categories`,
    mostOrder: () => `${API_BASE_URL}/me/menu-item/most-order`,
    basOnHistory: () => `${API_BASE_URL}/me/menu-item/based-on-history`,
    productFeedback: (params: string) =>
      `${API_BASE_URL}/feedback/menu-item/${params}`,
  },
  auth: {
    login: () => `${API_BASE_URL}/me/login`,
    refresh: () => `${API_BASE_URL}/me/refresh-token`,
    signUp: () => `${API_BASE_URL}/me/register`,
    forgotPassword: () => `${API_BASE_URL}/me/forgot-password`,
    resetPassWord: () => `${API_BASE_URL}/me/reset-password`,
    sendOtp: (phone: string) => `${API_BASE_URL}/me/send-otp?phone=${phone}`,
    verifyOtp: () => `${API_BASE_URL}/me/verify-otp`,
    mobileToken: () => `${API_BASE_URL}/me/mobile-token`,
  },
  coupon: {
    listValid: (promotionId?: string) => {
      const baseUrl = `${API_BASE_URL}/admin/coupons/available`;
      return promotionId ? `${baseUrl}/${promotionId}` : baseUrl;
    },
    listByIds: () => `${API_BASE_URL}/admin/coupons/by-ids`,
    list: (storeId: string) => `${API_BASE_URL}/admin/coupons/${storeId}`,
    detail: (id: string) => `${API_BASE_URL}/admin/coupon/${id}`,
    create: () => `${API_BASE_URL}/admin/coupon`,
    update: (id: string) => `${API_BASE_URL}/admin/coupon/${id}`,
    delete: (id: string) => `${API_BASE_URL}/admin/coupon/${id}`,
    trackUsage: (id: string) =>
      `${API_BASE_URL}/admin/coupon/${id}/track-usage`,
    setStatus: (id: string) => `${API_BASE_URL}/admin/coupon/${id}/status`,
    assignPromotion: (storeId: string) =>
      `${API_BASE_URL}/admin/coupon/${storeId}/assign-promotion`,
    couponValid: () => `${API_BASE_URL}/me/menu-item/coupons`,
  },
  category: {
    list: () => `${API_BASE_URL}/Category/categories`,
    create: () => `${API_BASE_URL}/Category`,
    detail: (params: string) => `${API_BASE_URL}/Category/${params}`,
    update: (param: string) => `${API_BASE_URL}/Category/${param}`,
    change: (action: string, id: string) =>
      `${API_BASE_URL}/Category/${action}/${id}`,
  },
  variant: {
    list: () => `${API_BASE_URL}/admin/variant-group/variants`,
  },
  image: {
    upload: () => `${API_BASE_URL}/admin/menu-item/sync-images`,
  },
  staff: {
    list: () => `${API_BASE_URL}/staff/list`,
    create: () => `${API_BASE_URL}/staff`,
    detail: (id: string) => `${API_BASE_URL}/staff/${id}`,
    update: (id: string) => `${API_BASE_URL}/staff/${id}`,
    callStaff: () => `${API_BASE_URL}/notify/staff`,
  },
  user: {
    profile: () => `${API_BASE_URL}/user`,
    updateProfile: () => `${API_BASE_URL}/user/`,
  },
  cart: {
    addToCart: ({ tableId, actorId }: { tableId: string; actorId: string }) =>
      `${API_BASE_URL}/order/tables/${tableId}/cart/${actorId}`,
    get: ({ tableId, actorId }: { tableId: string; actorId: string }) =>
      `${API_BASE_URL}/order/get/table/${tableId}/cart/${actorId}`,
    hub: ({ storeId, tableId }: { storeId: string; tableId: string }) =>
      `${API_BASE_URL_HUB}/hubs/cart?dept=user&storeId=${storeId}&tableId=${tableId}`,
    delete: ({ tableId, actorId }: { tableId: string; actorId: string }) =>
      `${API_BASE_URL}/order/table/${tableId}/cart/${actorId}`,
  },
  checkout: {
    apply_discount: ({ actorId }: { actorId: string }) =>
      `${API_BASE_URL}/order/${actorId}/apply-discount`,
    create_cart: () => `${API_BASE_URL}/order`,
    payment: () => `${API_BASE_URL}/payment`,
  },
  order: {
    list: () => `${API_BASE_URL}/order/history`,
    detail: (id: string) => `${API_BASE_URL}/order/${id}`,
    feedback: () => `${API_BASE_URL}/feedback`,
    update: () => `${API_BASE_URL}/payment/receive-hook`,
  },
};

export default endpoints;
