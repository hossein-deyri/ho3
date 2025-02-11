import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

//components
import { DisableButton } from "@/components/disableButton";
import StyledTable from "@/components/styledTable";
import CreateOrderManagement from "../create";

//api
import { ProductOrderingServices } from "../api";

//type
import {
  ProductOrdering,
  ProductOrderingRes,
} from "@/types/model/entity/productOrdering.model";
import { TableProps } from "./type";

//antd
import { Button, Form, Popconfirm, Space, Tag } from "antd";
import { ColumnsType } from "antd/es/table";

//icon
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";

//langs
import { useTranslation } from "react-i18next";
import { messages } from "../messages";
import { useAppSelector } from "@/redux/hooks";
import moment from "jalali-moment";

const service = new ProductOrderingServices();

const TableOrder = (props: TableProps) => {
  const { activeDrawer, activePagination, rowTable } = props;
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [hasDrawer, setHasDrawer] = useState<boolean>(activeDrawer);
  const [haspagination, setHaspagination] = useState<boolean>(activePagination);
  const [countRow, setCountRow] = useState<number | boolean>(rowTable);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");
  const [editOrderData, setEditOrderData] = useState<ProductOrdering | null>(
    null
  );
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { lang } = useAppSelector((state) => state.lang);
  const showDrawer = () => {
    setOpenDrawer(true);
    setOrderId("");
    setEditOrderData(null);
  };

  const onCloseDrawer = () => {
    setOpenDrawer(false);
    setIsEdit(false);
  };
  const queryClient = useQueryClient();
  const {
    data: productOrderingData,
    isLoading,
    refetch: productOrderingRefetch,
  } = useQuery({
    queryKey: ["orderManagementData"],
    queryFn: async () => {
      const data = await service.getList({});
      return data.data;
    },
  });

  //edit data
  const handleEdit = async (id: string) => {
    const { data } = await service.getById(id);
    setOrderId(id);
    setIsEdit(true);
    setOpenDrawer(true);
    setEditOrderData(data);
  };

  //delete data
  const { mutateAsync } = useMutation({
    mutationFn: async (id: string) => {
      const data = await service.delete(id);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderManagementData"] });
    },
  });

  const handleDelete = async (id: string) => {
    await mutateAsync(id);
  };
  const columns: ColumnsType<ProductOrderingRes> = [
    {
      title: t(messages.date),
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: t(messages.time),
      dataIndex: "orderTime",
      key: "orderTime",
    },
    {
      title: t(messages.partyAccount),
      dataIndex: "partyAccount",
      key: "partyAccount",
    },
    {
      title: t(messages.status),
      key: "status",
      dataIndex: "status",
      render: (status) => {
        return (
          <Tag color={"geekblue"} key={status}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: t(messages.productOffer),
      dataIndex: "productOffer",
      key: "productOffer",
    },
    {
      title: t(messages.payment),
      dataIndex: "payment",
      key: "payment",
    },

    {
      title: t(messages.action),
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        const findOrderItem = productOrderingData?.find(
          (item) => item.id === record.id
        )?.productOrderItem;
        const productOrderItems =
          findOrderItem &&
          findOrderItem[findOrderItem.length - 1]?.productOffering?.name
            ?.length;
        return (
          <>
            <Space size="middle" className="flex justify-left gap-x-5">
              {hasDrawer ? (
                <>
                  <Button
                    className="border-none p-0"
                    onClick={() => handleEdit(record.id ? record.id : "")}
                  >
                    <EditOutlined />
                  </Button>
                  <Popconfirm
                    title={t(messages.sureToDelete)}
                    onConfirm={() => handleDelete(record.id ? record.id : "")}
                    okText={t(messages.yes)}
                    cancelText={t(messages.no)}
                  >
                    {productOrderItems && productOrderItems <= 10 ? (
                      <Button className="border-none p-0">
                        <DeleteOutlined />
                      </Button>
                    ) : (
                      <DisableButton value={<DeleteOutlined />} disabled />
                    )}
                  </Popconfirm>
                </>
              ) : (
                <>
                  <Button className="border-none p-0">
                    <EyeOutlined />
                  </Button>
                  <Button className="border-none p-0">
                    <DisableButton value={<EditOutlined />} disabled />
                  </Button>
                  <Button className="border-none p-0">
                    <DisableButton value={<DeleteOutlined />} disabled />
                  </Button>
                </>
              )}
            </Space>
          </>
        );
      },
    },
  ];

  const dataTable: ProductOrderingRes[] | any = productOrderingData
    ? productOrderingData
        .slice(0, haspagination ? productOrderingData.length : 3)
        .map((item) => ({
          id: item.id,
          partyAccount: "test",
          status: item.state,
          productOffer: item.productOrderItem
            ?.slice(-1)
            .map((orderItem) => orderItem.productOffering?.name),
          payment: t(messages.cash),
          orderDate: lang
            ? moment(item.lastUpdate).locale("fa").format("YYYY-MM-DD")
            : item.lastUpdate?.toString().slice(0, 10),
          orderTime: lang
            ? item.lastUpdate?.toString().slice(11, 16)
            : item.lastUpdate?.toString().slice(11, 16),
        }))
    : [];

  return (
    <>
      {hasDrawer && openDrawer && (
        <CreateOrderManagement
          openDrawer={openDrawer}
          onClose={onCloseDrawer}
          refetch={productOrderingRefetch}
          isEdit={isEdit}
          orderId={orderId}
          editOrderData={editOrderData ? editOrderData : null}
          form={form}
        />
      )}
      {hasDrawer && (
        <Button
          onClick={showDrawer}
          className="flex items-center bg-primary text-white mb-6"
        >
          <PlusOutlined />
          {t(messages.create)}
        </Button>
      )}

      <StyledTable
        columns={columns}
        dataSource={dataTable}
        loading={isLoading}
        pagination={{ pageSize: countRow, hideOnSinglePage: true }}
      />
    </>
  );
};

export default TableOrder;
