// import { useQuery } from "@tanstack/react-query";
// import { CustomerService } from "@/services/customer/customer-service";
import { useState } from "react";
import { useTranslation} from 'react-i18next'

// const customerService = new CustomerService();

function Dashboard() {
  const { t } = useTranslation();
  const [toggle, setToggle] = useState<boolean>(false);
//   const [usersList, setUsersList] = useState<any>([]);

//   const query = useQuery(
//     ["usersList", toggle],
//     async () => await customerService.getListWithOutToken(),
//     { staleTime: 0 }
//   );

//   if (query.isLoading) {
//     return <>...loading</>;
//   }
  return (
    <>
      <div onClick={() => setToggle(!toggle)}>Dashboard</div>
      {toggle ? "true" : "false"}

      <div>{t("app_title")}</div>
      {/* {query?.data?.length !== 0 &&
        query?.data?.map((item: any) => {
          return <>{item.name}</>;
        })} */}
    </>
  );
}
export default Dashboard;
