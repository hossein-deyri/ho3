import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { removeKeyFromObjectArray } from "@/tools/pure-function/deleteFormDeepCopy";
import messages from "./messages";

//components
import {
  Button,
  Divider,
  Drawer,
  Form,
  FormInstance,
  Popconfirm,
  Space,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import PartyCharacteristicForm from "./partyCharacteristicForm";
import StyledTable from "@/components/styledTable";

//icon
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";

//types
import { IIndividualpartyCharacteristic } from "@/types/model/redux/individualParty";
import { CHARACTERISTIC_VALUE_TYPE } from "@/types/enum/partyManagement";
import { StepCopmonentProps } from "@/pages/partyManagment/create/type";
import { IOrganizationpartyCharacteristic } from "@/types/model/redux/organizationParty";

//redux
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { individualDeleteCharacterstic } from "@/redux/slices/partyManagment/individualParty.Slice";
import { organizationDeleteCharacterstic } from "@/redux/slices/partyManagment/organizationParty.slice";

//api
import { PartyIndividualServices } from "../../IndividualParty/api";
import { organizationPartyServices } from "../../organizationParty/api";

interface pageProps extends StepCopmonentProps {
  isOrganization?: boolean;
}

const PartyCharacteristic: React.FC<pageProps> = ({
  onNext,
  onCompletedStep,
  stepNumber,
  onPrev,
  isOrganization,
}) => {
  //service
  const individualService = new PartyIndividualServices();
  const organizationService = new organizationPartyServices();

  const [open, setOpen] = useState(false);
  const [individualEditCharstic, setIndividualEditCharstic] =
    useState<IIndividualpartyCharacteristic | null>(null);
  const [organizationEditCharstic, setOrganizationEditCharstic] =
    useState<IOrganizationpartyCharacteristic | null>(null);
  const [selectedName, setSelectedName] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const formRef = React.useRef<FormInstance>(null);
  const { t } = useTranslation();
  const { lang } = useAppSelector((state) => state.lang);
  const dispatch = useAppDispatch();

  //slices
  const {
    partyCharacteristic: individualCharacteristic,
    contactMedium: individualContactMedium,
    individualIdentification,
    id: individualId,
    ...individualRest
  } = useAppSelector((state) => state.individualParty);
  const {
    partyCharacteristic: organizationCharactistic,
    contactMedium: organizationContactMedium,
    organizationIdentification,
    id: organizationId,
    ...organizationRest
  } = useAppSelector((state) => state.organizationParty);

  //delete data
  const handleDelete = (id: string) => {
    const deleteAction = isOrganization
      ? organizationDeleteCharacterstic
      : individualDeleteCharacterstic;
    dispatch(deleteAction(id));
  };

  //individual create
  const { mutate: individualMutate } = useMutation({
    mutationFn: ({
      individualId,
      value,
    }: {
      individualId: string;
      value: any;
    }) => {
      return individualService.updatePut(
        {
          partyCharacteristic: value.partyCharacteristic,
          contactMedium: value.contactMedium,
          individualIdentification: value.individualIdentification,
          ...individualRest,
        },
        individualId
      );
    },
    onSuccess: () => {
      onNext();
      onCompletedStep?.(stepNumber);
    },
  });

  //organization create
  const { mutate: organizationMutate } = useMutation({
    mutationFn: ({
      organizationId,
      value,
    }: {
      organizationId: string;
      value: any;
    }) => {
      return organizationService.updatePut(
        {
          partyCharacteristic: value.partyCharacteristic,
          contactMedium: value.contactMedium,
          organizationIdentification: value.organizationIdentification,
          ...organizationRest,
        },
        organizationId
      );
    },
    onSuccess: () => {
      onNext();
      onCompletedStep?.(stepNumber);
    },
  });

  // create characteristic
  const handleCreateCharacteristic = () => {
    if (individualId) {
      individualMutate({
        individualId,
        value: {
          partyCharacteristic: removeKeyFromObjectArray(
            individualCharacteristic || [],
            "id"
          ),
          contactMedium: removeKeyFromObjectArray(
            individualContactMedium || [],
            "id"
          ),
          individualIdentification: removeKeyFromObjectArray(
            individualIdentification || [],
            "id"
          ),
        },
      });
    } else if (organizationId) {
      organizationMutate({
        organizationId,
        value: {
          partyCharacteristic: removeKeyFromObjectArray(
            organizationCharactistic || [],
            "id"
          ),
          contactMedium: removeKeyFromObjectArray(
            organizationContactMedium || [],
            "id"
          ),
          organizationIdentification: removeKeyFromObjectArray(
            organizationIdentification || [],
            "id"
          ),
        },
      });
    }
  };

  useEffect(() => {
    const characteristicMap = isOrganization
      ? organizationCharactistic
      : individualCharacteristic;
    characteristicMap?.map(({ id, name, value, valueType }) => {
      return {
        id,
        name,
        value,
        valueType,
      };
    }) || [];
  }, [organizationCharactistic || individualCharacteristic]);

  //edit characteristic
  const handleEditCharacteristic = (id: string) => {
    const editCharsticdata = isOrganization
      ? organizationCharactistic?.find((item) => item.id === id)
      : individualCharacteristic?.find((item) => item.id === id);
    setIndividualEditCharstic(editCharsticdata ? editCharsticdata : null);
    setOrganizationEditCharstic(editCharsticdata ? editCharsticdata : null);
    if (editCharsticdata) {
      setOpen(true);
      setIsEdit(true);
      setSelectedName(editCharsticdata?.name || "");
      formRef.current?.setFieldsValue({
        characteristicName: editCharsticdata?.name,
      });
      if (editCharsticdata?.valueType === CHARACTERISTIC_VALUE_TYPE.BOOLEAN) {
        formRef.current?.setFieldsValue(true);
      } else if (
        editCharsticdata?.valueType === CHARACTERISTIC_VALUE_TYPE.NUMBER
      ) {
        formRef.current?.setFieldsValue({
          characteristicInput: "" + editCharsticdata?.value,
        });
      } else {
        formRef.current?.setFieldsValue({
          characteristicIndustry: "" + editCharsticdata?.value,
        });
      }
    }
  };

  //drawer
  const showDrawer = () => {
    setOpen(true);
    setIsEdit(false);
    form.resetFields();
  };

  const onClose = () => {
    setOpen(false);
    setIndividualEditCharstic(null);
    setOrganizationEditCharstic(null);
    setSelectedName("");
  };

  //table
  const columns: ColumnsType<
    IIndividualpartyCharacteristic | IOrganizationpartyCharacteristic
  > = [
    {
      title: t(messages.name),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t(messages.value),
      dataIndex: "value",
      key: "value",
    },
    {
      title: t(messages.action),
      key: "action",
      render: (record) => (
        <Space size="middle" className="flex justify-left gap-x-5">
          <a>
            <Popconfirm
              title={t(messages.sureToDelete)}
              onConfirm={() => handleDelete(record.id)}
              okText={t(messages.yes)}
              cancelText={t(messages.no)}
            >
              <DeleteOutlined />
            </Popconfirm>
          </a>
          {isOrganization ? (
            organizationCharactistic?.find((item) => item.id === record.id)
              ?.valueType !== "boolean" ? (
              <a onClick={() => handleEditCharacteristic(record.id)}>
                <EditOutlined />
              </a>
            ) : (
              ""
            )
          ) : individualCharacteristic?.find((item) => item.id === record.id)
              ?.valueType !== "boolean" ? (
            <a onClick={() => handleEditCharacteristic(record.id)}>
              <EditOutlined />
            </a>
          ) : (
            ""
          )}
        </Space>
      ),
    },
  ];
  const dataTableCondition = isOrganization
    ? organizationCharactistic
    : individualCharacteristic;

  const dataTable:
    | IIndividualpartyCharacteristic[]
    | IOrganizationpartyCharacteristic[] = dataTableCondition
    ? dataTableCondition.map((item) => ({
        id: item.id,
        name: item.name,
        value:
          item.value === true || item.value === "true" ? (
            <CheckOutlined />
          ) : (
            item.value
          ),
      }))
    : [];

  return (
    <div className="w-full">
      <Button
        type="primary"
        onClick={showDrawer}
        className="flex items-center bg-primary"
      >
        <PlusOutlined />
        {t(messages.add)}
      </Button>
      <Drawer placement="right" onClose={onClose} open={open} width={580}>
        <PartyCharacteristicForm
          isOrganization={isOrganization}
          onClose={onClose}
          individualEditCharstic={
            individualEditCharstic ? individualEditCharstic : null
          }
          organizationEditCharstic={
            organizationEditCharstic ? organizationEditCharstic : null
          }
          selectedName={selectedName}
          setSelectedName={setSelectedName}
          isEdit={isEdit}
          form={form}
          formRef={formRef}
        />
      </Drawer>
      <Divider />
      <StyledTable columns={columns} dataSource={dataTable} />
      <div className="flex mt-8">
        <Button
          onClick={onPrev}
          className={` mr-1 flex items-center ${lang ? "ml-1" : ""}`}
        >
          {!lang ? <LeftOutlined /> : <RightOutlined />}

          {t(messages.back)}
        </Button>
        <Button
          onClick={handleCreateCharacteristic}
          className=" flex items-center mr-1 "
        >
          {t(messages.next)}
          {lang ? <LeftOutlined /> : <RightOutlined />}
        </Button>
      </div>
    </div>
  );
};
export default PartyCharacteristic;
