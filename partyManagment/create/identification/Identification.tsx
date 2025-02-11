import StyledTable from "@/components/styledTable";
import {
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Divider, Drawer, Space, Popconfirm } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import IdentificationForm from "./IdentificationForm";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useMutation } from "@tanstack/react-query";
import { PartyIndividualServices } from "../../IndividualParty/api";
import dayjs from "dayjs";
import { StepCopmonentProps } from "../type";
import { removeKeyFromObjectArray } from "@/tools/pure-function/deleteFormDeepCopy";
import { organizationPartyServices } from "@/pages/partyManagment/organizationParty/api";
import { IndividualIdentification } from "@/types/model/redux/individualParty";
import { IOrganizationIdentification } from "@/types/model/redux/organizationParty";
import { removeIdentificationOrganizationParty } from "@/redux/slices/partyManagment/organizationParty.slice";
import { removeIdentificationIndividualParty } from "@/redux/slices/partyManagment/individualParty.Slice";
import messages from "./messages";
import { IDENTIFICATION_TYPE } from "@/types/enum/partyManagement";

const individualService = new PartyIndividualServices();
const organizationServices = new organizationPartyServices();

interface Props extends StepCopmonentProps {
  isOrganization?: boolean;
}

const Identification = (props: Props) => {
  const { onNext, onCompletedStep, stepNumber, onPrev, isOrganization } = props;

  const { t } = useTranslation();
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [dataTable, setDateTable] = useState<any[]>([]);
  const { lang } = useAppSelector((state) => state.lang);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [editIdentification, setEditIdentification] = useState<
    IOrganizationIdentification | IndividualIdentification
  >();

  const {
    organizationIdentification,
    contactMedium: organizationContacts,
    id: organizationId,
    ...organizationRest
  } = useAppSelector((state) => state.organizationParty);
  const dispath = useAppDispatch();

  const {
    individualIdentification,
    contactMedium: individualContacts,
    id: individualId,
    ...individualRest
  } = useAppSelector((state) => state.individualParty);

  const mutateOrganization = useMutation({
    mutationFn: ({ id, value }: { id: string; value: any }) => {
      return organizationServices.updatePut(
        {
          contactMedium: value.contactMedium,
          organizationIdentification: value.organizationIdentification,
          ...organizationRest,
        },
        id
      );
    },
    onSuccess: () => {
      onCompletedStep?.(stepNumber);
      onNext();
    },
  });

  const mutateIndividual = useMutation({
    mutationFn: ({ id, value }: { id: string; value: any }) => {
      return individualService.updatePut(
        {
          contactMedium: value.contactMedium,
          individualIdentification: value.individualIdentification,
          ...individualRest,
        },
        id
      );
    },
    onSuccess: () => {
      onCompletedStep?.(stepNumber);
      onNext();
    },
  });

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
    setEditIdentification({});
    setIsEdit(false);
  };

  const handleSaveIdentification = () => {
    if (isOrganization) {
      if (organizationId) {
        mutateOrganization.mutate({
          id: organizationId,
          value: {
            contactMedium: removeKeyFromObjectArray(
              organizationContacts || [],
              "id"
            ),
            organizationIdentification: removeKeyFromObjectArray(
              organizationIdentification || [],
              "id"
            ),
          },
        });
      }
    } else {
      if (individualId) {
        mutateIndividual.mutate({
          id: individualId,
          value: {
            contactMedium: removeKeyFromObjectArray(
              individualContacts || [],
              "id"
            ),
            individualIdentification: removeKeyFromObjectArray(
              individualIdentification || [],
              "id"
            ),
          },
        });
      }
    }
  };

  const handlePartyIdentifications = (
    identifications?: IOrganizationIdentification[] | IndividualIdentification[]
  ) => {
    const data =
      identifications?.map(
        ({
          identificationType,
          identificationId,
          issuingAuthority,
          validFor,
          id,
        }) => {
          return {
            id,
            identificationType:
              identificationType === IDENTIFICATION_TYPE.NATIONAL_CARD
                ? t(messages.nationalCode)
                : identificationType === IDENTIFICATION_TYPE.PASSPORT
                ? t(messages.passport)
                : t(messages.commercialRegistration),
            identificationId,
            issuingAuthority,
            endDateTime: validFor?.endDateTime,
          };
        }
      ) || [];
    return data;
  };

  useEffect(() => {
    let identificationInput = isOrganization
      ? organizationIdentification
      : individualIdentification;
    let identificationTable = handlePartyIdentifications(identificationInput);

    setDateTable(identificationTable);
  }, [individualIdentification, organizationIdentification, t]);

  const handleOpenEdit = (id: string) => {
    let editIdentification;
    if (isOrganization) {
      editIdentification = organizationIdentification?.find(
        (item) => item.id === id
      );
    } else {
      editIdentification = individualIdentification?.find(
        (item) => item.id === id
      );
    }

    setEditIdentification(editIdentification);

    if (editIdentification) {
      setOpenAdd(true);
    }
    setIsEdit(true);
  };

  const handleDelete = async (id: string) => {
    if (isOrganization) {
      await dispath(removeIdentificationOrganizationParty(id));
    } else {
      await dispath(removeIdentificationIndividualParty(id));
    }
  };

  const columns: ColumnsType<any> = [
    {
      dataIndex: "identificationType",
      title: t(messages.identificationType),
      key: "identificationType",
    },
    {
      dataIndex: "identificationId",
      title: t(messages.identificationId),
      key: "identificationId",
    },
    {
      dataIndex: "issuingAuthority",
      title: t(messages.issuingAuthority),
      key: "issuingAuthority",
    },
    {
      dataIndex: "endDateTime",
      title: t(messages.endDateTime),
      key: "endDateTime",
      render: (_, record) => (
        <span>
          {lang
            ? new Date(record.endDateTime).toLocaleDateString("fa-IR")
            : dayjs(record.endDateTime).format("YYYY-MM-DD")}
        </span>
      ),
    },
    {
      title: t(messages.action),
      dataIndex: "",
      key: "x",
      render: (_, record) => {
        return (
          <Space size="middle" className="flex justify-left gap-x-5">
            <span
              onClick={() => handleOpenEdit(record.id)}
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
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <Button
        type="primary"
        onClick={() => {
          handleOpenAdd();
        }}
        className="flex items-center bg-primary"
      >
        <PlusOutlined />
        {t(messages.add)}
      </Button>
      <Divider />
      <Drawer
        // title="Add Identification"
        width={500}
        closable={false}
        onClose={handleCloseAdd}
        open={openAdd}
        destroyOnClose
      >
        <IdentificationForm
          onClose={handleCloseAdd}
          isOrganization={isOrganization}
          isEdit={isEdit}
          editItem={editIdentification}
        />
      </Drawer>

      <StyledTable columns={columns} dataSource={dataTable} loading={false} />
      <div className="flex mt-8">
        <Button
          className={`flex items-center ${lang ? "ml-1" : ""}`}
          onClick={onPrev}
        >
          {!lang ? <LeftOutlined /> : <RightOutlined />}

          {t(messages.back)}
        </Button>
        <Button
          className="flex items-center ml-1"
          onClick={handleSaveIdentification}
          loading={false}
        >
          {t(messages.next)}
          {lang ? <LeftOutlined /> : <RightOutlined />}
        </Button>
      </div>
    </div>
  );
};

export default Identification;
