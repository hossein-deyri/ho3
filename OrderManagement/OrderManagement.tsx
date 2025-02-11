import TableOrder from "./tableOrder/TableOrder";

const OrderManagement: React.FC = () => {
  return (
    <TableOrder activeDrawer={true} activePagination={true} rowTable={8} />
  );
};
export default OrderManagement;
