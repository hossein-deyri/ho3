import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/types/enum/appRoutes";
import MainLayout from "./../components/layout/main";

//pages
import { IndividualPartyPage } from "./partyManagment/IndividualParty";
import { OrganizationPartyPage } from "./partyManagment/organizationParty";
import { CataloguePage } from "./productManagment/catalogue";
import { RegistrationPage } from "./Registration";
import { CategoryPage } from "./productManagment/category";
import { SpecificationPage } from "./productManagment/specification";
import { ProductOfferingPricePage } from "./productManagment/productOfferingPrice";
import { ProductOfferingPage } from "./productManagment/productOffering";
import { OrderManagementPage } from "./OrderManagement";
import { InventoryPage } from "./productManagment/inventory";
import Statistic from "./Statistic/Statistic";

//hooks
import useLoginState from "../tools/hooks/use-login-state";
const NotfoundPage = React.lazy(() => import("./notFoundPage/notfoundPage"));
const TestPage = React.lazy(() => import("./TestPage/testPage"));

const Router: React.FC = () => {
  useLoginState();

  return (
    <>
      <Routes>
        <Route path={APP_ROUTES.NOT_FOUND} element={<NotfoundPage />} />
        <Route element={<MainLayout />}>
          <Route path={APP_ROUTES.ROOT} element={<IndividualPartyPage />} />
          {/* <Route path={"/t"} element={<TestPage />} /> */}
          <Route
            path={APP_ROUTES.ORGANIZATION_PARTY}
            element={<OrganizationPartyPage />}
          />
          <Route
            path={APP_ROUTES.REGISTRATION}
            element={<RegistrationPage />}
          />
          <Route path={APP_ROUTES.CATALOG} element={<CataloguePage />} />
          <Route path={APP_ROUTES.CATEGORY} element={<CategoryPage />} />
          <Route
            path={APP_ROUTES.SPECIFICATION}
            element={<SpecificationPage />}
          />
          <Route
            path={APP_ROUTES.PRODUCT_OFFERING}
            element={<ProductOfferingPage />}
          />
          <Route
            path={APP_ROUTES.PRODUCT_OFFERING_PRICE}
            element={<ProductOfferingPricePage />}
          />
          <Route
            path={APP_ROUTES.PRODUCT_INVENTORY}
            element={<InventoryPage />}
          />
          <Route
            path={APP_ROUTES.ORDER_MANAGEMENT}
            element={<OrderManagementPage />}
          />
          <Route
            path={APP_ROUTES.STATISTIC}
            element={<Statistic />}
          />
        </Route>
      </Routes>
    </>
  );
};
export default Router;
