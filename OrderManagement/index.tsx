import { lazyLoad } from "@/tools/HOC/Loadable";

export const OrderManagementPage = lazyLoad(
  () => import("./OrderManagement"),
  (module) => module.default
);
