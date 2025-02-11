import { useEffect, useRef, useState } from "react";
import CreateOrganizationParty from "./create";
import { useAppDispatch } from "@/redux/hooks";
import { Button, Divider, Input, InputRef, Popconfirm, Space, Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import StyledTable from "@/components/styledTable";
import { organizationPartyServices } from "./api";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ColumnType, ColumnsType } from "antd/es/table";
import { FilterConfirmProps } from "antd/es/table/interface";
import {
  clearIndividualParty,
  storeSingleOrganizationParty,
} from "@/redux/slices/partyManagment/organizationParty.slice";
import { IOrganizationParty } from "@/types/model/redux/organizationParty";
import messages from "./messages";

const services = new organizationPartyServices();

const OrganizationParty = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [isEdit, setisEdit] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const searchInput = useRef<InputRef>(null);

  const [tradingName, setTradingName] = useState("");
  const [organizationIdentificationId, setOrganizationIdentificationId] =
    useState("");

  const {
    data: partyData,
    isLoading,
    refetch: organizationRefetch,
  } = useQuery({
    queryKey: [
      "party",
      "organization",
      tradingName,
      organizationIdentificationId,
    ],
    queryFn: async (payload: any) => {
      const data = await services.getList({
        tradingName,
        organizationIdentificationId,
      });
      return data;
    },
    refetchOnWindowFocus: true,
  });

  const { mutateAsync, isLoading: deleteLoading } = useMutation({
    mutationFn: async (id: string) => {
      const data = await services.delete(id);
      return data;
    },
    onSuccess: () => {
      organizationRefetch();
    },
  });

  // useEffect(() => {
  //   alert("fjbwlkjfb")
  // },  [partyData])

  const handleEdit = async (id: string) => {
    const { data } = await services.getById(id);
    dispatch(storeSingleOrganizationParty(data));
    setOpenDrawer(true);
    setisEdit(true);
  };

  const handleDelete = async (id: string) => {
    // const data = await service.delete(id);
    await mutateAsync(id);
    // refetch();
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: any
  ) => {
    switch (dataIndex) {
      case "tradingName":
        setTradingName(selectedKeys[0].trim());
        break;
      case "organizationIdentificationId":
        setOrganizationIdentificationId(selectedKeys[0].trim());
        break;
      default:
        break;
    }
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
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
            className="bg-primary"
          >
            {t(messages.search)}
          </Button>
          {/* <Button
            // onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button> */}
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
    // onFilter: (value, record) =>
    //   record[dataIndex]
    //     .toString()
    //     .toLowerCase()
    //     .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  const columns: ColumnsType<IOrganizationParty> = [
    {
      title: t(messages.tradingName),
      dataIndex: "tradingName",
      key: "tradingName",
      // filterDropdownOpen: true,
      ...getColumnSearchProps("tradingName"),
    },
    {
      title: t(messages.nameType),
      dataIndex: "nameType",
      key: "nameType",
      render: (type) => (
        <Tag color={"success"} key={type}>
          {type?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: t(messages.otherName),
      dataIndex: "otherName",
      key: "organizationType",
      render: (_, record) => {
        return <span>{record.otherName && record.otherName?.name}</span>;
      },
    },
    {
      title: t(messages.organizationType),
      dataIndex: "organizationType",
      key: "organizationType",
      render: (status) => (
        <Tag color={"error"} key={status}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: t(messages.status),
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <Tag color={"geekblue"} key={status}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: t(messages.identificationId),
      dataIndex: "identificationId",
      key: "familyName",
      render: (_, { organizationIdentification = [] }) => {
        const hasNationalCard: any = organizationIdentification.find(
          (item: any) => item.identificationType === "commercialRegistration"
        );
        const hasPassport = organizationIdentification.find(
          (item: any) => item.identificationType === "passport"
        );
        const identificationPrioritization = hasNationalCard || hasPassport;
        return (
          <div>
            <Tag
              key={hasNationalCard}
              bordered={false}
              color="#55acee"
              className="text-[10px]"
            >
              {identificationPrioritization?.identificationType ===
                "commercialRegistration"
                ? t(messages.commercialRegistration)
                : identificationPrioritization?.identificationType ===
                  "passport"
                  ? t(messages.passport)
                  : ""}
            </Tag>
            <Tag
              key={hasNationalCard}
              bordered={false}
              color="geekblue"
              className="text-xs"
            >
              {identificationPrioritization?.identificationId}
            </Tag>
          </div>
        );
      },
      ...getColumnSearchProps("organizationIdentificationId"),
    },
    {
      title: t(messages.action),
      dataIndex: "",
      key: "x",
      render: (record) => (
        <Space size="middle" className="flex justify-left gap-x-5">
          {/* <span>
            <EyeOutlined />
          </span>
           */}
          <span
            onClick={() => handleEdit(record.id)}
            className="cursor-pointer"
          >
            <EditOutlined />
          </span>
          <Popconfirm
            title={t(messages.sureToDelete)}
            onConfirm={() => handleDelete(record.id)}
            okText={t(messages.yes)}
            cancelText={t(messages.no)}
          >
            <DeleteOutlined />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleCloseDrawer = () => {
    setOpenDrawer((prev) => !prev);
    dispatch(clearIndividualParty());
  };
  const handleToggleDrawer = () => {
    setOpenDrawer((prev) => !prev);
    // if (!openDrawer) {
    //   dispatch(clearIndividualParty({}));
    // }
  };

  return (
    <>
      {openDrawer && (
        <CreateOrganizationParty
          openDrawer={openDrawer}
          onClose={handleCloseDrawer}
          isEdit={isEdit}
          organizationRefetch={organizationRefetch}
        />
      )}
      <Divider />
      <Button
        type="primary"
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
          loading={isLoading || deleteLoading}
        />
      </div>
    </>
  );
};

export default OrganizationParty;
