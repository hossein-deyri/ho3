import { lazyLoad } from "@/tools/HOC/Loadable";

export const OrganizationPartyPage = lazyLoad(
    () => import("./OrganizationParty"),
    (module) => module.default
  );