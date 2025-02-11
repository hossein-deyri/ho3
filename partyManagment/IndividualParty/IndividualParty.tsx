import { Button, Divider, Input, InputRef, Popconfirm, Space, Tag } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import StyledTable from "@/components/styledTable";
import { PartyIndividualServices } from "./api";
import CreateIndividualParty from "./create";
import type { ColumnType, ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearIndividualParty,
  storeSingleIndividualParty,
} from "@/redux/slices/partyManagment/individualParty.Slice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FilterConfirmProps } from "antd/es/table/interface";
import { IindividualParty } from "@/types/model/redux/individualParty";
import messages from "./messages";
// import { IindividualParty } from "./type";

const service = new PartyIndividualServices();

const IndividualParty = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [identificationId, setIdentificationId] = useState("");

  const queryClient = useQueryClient();

  const searchInput = useRef<InputRef>(null);

  const [isEdit, setisEdit] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  // fetch hooks
  const {
    data: partyData,
    isLoading,
    refetch: individualRefetch,
  } = useQuery({
    queryKey: ["party", "individual", identificationId],
    queryFn: async () => {
      const data = await service.getList({ identificationId });
      return data;
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (id: string) => {
      const data = await service.delete(id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["party", "individual"] });
    },
  });

  //handler
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: any
  ) => {
    switch (dataIndex) {
      case "individualIdentificationId":
        setIdentificationId(selectedKeys[0].trim());
        break;
      default:
        break;
    }
    confirm();
  };

  const getColumnSearchProps = (dataIndex: string): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={t(messages.search)}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            {t(messages.search)}
          </Button>
          <Button size="small" style={{ width: 90 }}>
            {t(messages.reset)}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            {t(messages.close)}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const handleOpenEdit = async (id: string) => {
    const { data } = await service.getById(id);
    dispatch(storeSingleIndividualParty(data));
    setOpenDrawer(true);
    setisEdit(true);
  };

  const handleToggleDrawer = () => {
    setOpenDrawer((prev) => !prev);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer((prev) => !prev);
    dispatch(clearIndividualParty());
  };

  const handleDelete = async (id: string) => {
    await mutateAsync(id);
  };

  const columns: ColumnsType<IindividualParty> = [
    {
      title: t(messages.givenName),
      dataIndex: "givenName",
      key: "name",
    },
    {
      title: t(messages.familyName),
      dataIndex: "familyName",
      key: "familyName",
    },
    {
      title: t(messages.status),
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <Tag color={"geekblue"} key={status}>
          {status && t(status.toUpperCase())}
        </Tag>
      ),
    },
    {
      title: t(messages.identificationId),
      dataIndex: "identificationId",
      key: "familyName",
      render: (_, { individualIdentification }) => {
        const hasNationalCard = individualIdentification?.find(
          (item: any) => item.identificationType === "nationalCard"
        );
        const hasPassport = individualIdentification?.find(
          (item: any) => item.identificationType === "passport"
        );
        const identificationPrioritization = hasNationalCard || hasPassport;
        return (
          <div>
            <Tag
              key={hasNationalCard?.id}
              bordered={false}
              color="#55acee"
              className="text-[10px]"
            >
              {identificationPrioritization?.identificationType ===
              "nationalCard"
                ? t(messages.nationalCode)
                : identificationPrioritization?.identificationType ===
                  "passport"
                ? t(messages.passport)
                : ""}
            </Tag>
            <Tag
              key={hasNationalCard?.id}
              bordered={false}
              color="geekblue"
              className="text-xs"
            >
              {identificationPrioritization?.identificationId}
            </Tag>
          </div>
        );
      },
      ...getColumnSearchProps("individualIdentificationId"),
    },
    {
      title: t(messages.action),
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <Space size="middle" className="flex justify-left gap-x-5">
          <span
            onClick={() => handleOpenEdit(record.id || "")}
            className="cursor-pointer"
          >
            <EditOutlined />
          </span>
          <Popconfirm
            title={t(messages.sureToDelete)}
            onConfirm={() => handleDelete(record.id || "")}
            okText={t(messages.yes)}
            cancelText={t(messages.no)}
          >
            <DeleteOutlined />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {openDrawer && (
        <CreateIndividualParty
          openDrawer={openDrawer}
          onClose={handleCloseDrawer}
          isEdit={isEdit}
          individualRefetch={individualRefetch}
        />
      )}
      <Divider />
      <Button
        // type="primary"
        onClick={() => {
          handleToggleDrawer();
        }}
        className="flex items-center bg-primary text-white"
      >
        <PlusOutlined />
        {t(messages.create)}
      </Button>
      <Divider />
      <div>
        <StyledTable
          columns={columns}
          dataSource={partyData?.data || []}
          loading={isLoading}
         
        />
      </div>
    </>
  );
};

export default IndividualParty;
