import { lazyLoad } from "@/tools/HOC/Loadable";

export const IndividualPartyPage = lazyLoad(
  () => import("./IndividualParty"),
  (module) => module.default
);
