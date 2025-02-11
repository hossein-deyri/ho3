import { useTranslation } from "react-i18next";
import { RefObject, SetStateAction, useState } from "react";
import messages from "./messages";

//components
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  message,
  Divider,
  Card,
  Space,
} from "antd";
import { MessageInstance } from "antd/es/message/interface";
import type { FormInstance, SelectProps } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
const { Option } = Select;

//types
import { IIndividualpartyCharacteristic } from "@/types/model/redux/individualParty";
import { CHARACTERISTIC_VALUE_TYPE } from "@/types/enum/partyManagement";
import { IOrganizationpartyCharacteristic } from "@/types/model/redux/organizationParty";

//api
import {
  IndividualPartyConstantsService,
  OrganizationPartyConstantsService,
} from "./api";
import { useMutation, useQuery } from "@tanstack/react-query";

//redux
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  individualCreateCharacteristic,
  individualEditCharacteristic,
} from "@/redux/slices/partyManagment/individualParty.Slice";
import {
  organizationEditCharacteristic,
  organizationCreateCharacteristic,
} from "@/redux/slices/partyManagment/organizationParty.slice";

//dynamic form
import FormDynamicRenderer from "@/components/dynamic-render/Form-Render-Component/Form/Form";
import FormElement from "@/components/dynamic-render/Form-Render-Component/Form/FormElement";

//icons
import { CheckOutlined } from "@ant-design/icons";

interface pageProps {
  isOrganization?: boolean;
  onClose: () => void;
  selectedName: string;
  setSelectedName: (value: SetStateAction<string>) => void;
  isEdit: boolean;
  form: FormInstance<any>;
  formRef: RefObject<FormInstance<any>>;
  individualEditCharstic: IIndividualpartyCharacteristic | null;
  organizationEditCharstic: IOrganizationpartyCharacteristic | null;
}

const PartyCharacteristicForm: React.FC<pageProps> = ({
  isOrganization,
  onClose,
  selectedName,
  setSelectedName,
  isEdit,
  form,
  formRef,
  individualEditCharstic,
  organizationEditCharstic,
}) => {
  //services
  const individualService = new IndividualPartyConstantsService();
  const organizationService = new OrganizationPartyConstantsService();
  const dispatch = useAppDispatch();
  const { partyCharacteristic: individualPartyCharacteristic } = useAppSelector(
    (state) => state.individualParty
  );
  const { partyCharacteristic: organizationPartyCharacteristic } =
    useAppSelector((state) => state.organizationParty);
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  //individual get data
  const { data: individualNameList } = useQuery({
    queryKey: ["individualCharacteristic"],
    queryFn: async () => {
      const data = await individualService.getList({
        type: "INDIVIDUAL_CHARACTERISTIC",
        language: "fa",
      });
      return data.data;
    },
  });

  //organization get data
  const { data: organizationNameList } = useQuery({
    queryKey: ["organizationCharacteristic"],
    queryFn: async () => {
      const data = await organizationService.getList({
        type: "ORGANIZATION_CHARACTERISTICS",
        language: "fa",
      });
      return data.data;
    },
  });

  //handle change
  const handleChange = (value: string) => {
    setSelectedName(value);
  };
  const selectedOptionValue =
    isOrganization
      ? organizationNameList?.find((item) => item.title === selectedName)
          ?.valueType
      : individualNameList?.find((item) => item.title === selectedName)
          ?.valueType;

  //options
  const options =
    isOrganization
      ? organizationNameList &&
        organizationNameList.map((item, index) => ({
          key: `charstic_${index}`,
          value: item.title,
        }))
      : individualNameList &&
        individualNameList.map((item, index) => ({
          key: `charstic_${index}`,
          value: item.title,
        }));

  const selectCodition = () => {
    if (
      selectedOptionValue?.split(",")?.length === 1 &&
      selectedOptionValue === "Boolean"
    ) {
      return (
        <Form.Item<
          IIndividualpartyCharacteristic | IOrganizationpartyCharacteristic
        >
          name="characteristicCheckbox"
          label={t(messages.value)}
          valuePropName="checked"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: t(messages.required) }]}
        >
          <Checkbox></Checkbox>
        </Form.Item>
      );
    } else if (
      selectedOptionValue &&
      selectedOptionValue?.split(",")?.length > 1
    ) {
      const fixJson = selectedOptionValue;
      const convertedJson = JSON.parse(fixJson);
      return (
        <Form.Item<
          IIndividualpartyCharacteristic | IOrganizationpartyCharacteristic
        >
          name="characteristicSelect"
          label={t(messages.value)}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: t(messages.required) }]}
        >
          <Select
            showSearch
            className="w-full"
            placeholder={t(messages.placeholder)}
            optionFilterProp="children"
            // filterOption={(input, option) =>
            //   (option?.value ?? "").toLowerCase().includes(input.toLowerCase())
            // }
            options={convertedJson.map((item: any, index: number) => ({
              key: `charsticValue_${index}`,
              value: item.name,
            }))}
            // size="large"
          />
        </Form.Item>
      );
    } else if (
      selectedOptionValue?.split(",")?.length === 1 &&
      (selectedOptionValue === "string" || selectedOptionValue === "Int")
    ) {
      return (
        <Form.Item<IOrganizationpartyCharacteristic>
          name="characteristicInput"
          label={t(messages.value)}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: t(messages.required) }]}
        >
          <Input
          // size="large"
          />
        </Form.Item>
      );
    } else null;
  };

  //Submit
  const onFinish = (values: any) => {
    const finalValues = {
      name: values.characteristicName,
      value: values[Object.keys(values)[1]],
      valueType:
        selectedOptionValue === "Int"
          ? CHARACTERISTIC_VALUE_TYPE.NUMBER
          : selectedOptionValue === "Boolean"
          ? CHARACTERISTIC_VALUE_TYPE.BOOLEAN
          : CHARACTERISTIC_VALUE_TYPE.STRING,
    };
  
    const partyCharacteristic = isOrganization
      ? organizationPartyCharacteristic
      : individualPartyCharacteristic;
  
    const editCharstic = isOrganization
      ? organizationEditCharstic
      : individualEditCharstic;
  
    if (!editCharstic) {
      if (
        !partyCharacteristic?.find(
          (item: any) => item.name === values.characteristicName
        )
      ) {
        if (isOrganization) {
          dispatch(organizationCreateCharacteristic({ ...finalValues }));
        } else {
          dispatch(individualCreateCharacteristic({ ...finalValues }));
        }
      } else {
        messageApi.open({
          type: "error",
          content: t(messages.alreadyEntered),
        });
      }
      form.resetFields();
    } else {
      if (isOrganization) {
        dispatch(
          organizationEditCharacteristic({
            id: editCharstic.id,
            ...finalValues,
          })
        );
      } else {
        dispatch(
          individualEditCharacteristic({
            id: editCharstic.id,
            ...finalValues,
          })
        );
      }
      onClose();
    }
    setSelectedName("");
  };

  return (
    <>
      {contextHolder}
      <Form
        ref={formRef}
        name="characteristicForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        labelWrap={false}
        labelAlign="left"
        size="middle"
        layout={"vertical"}
        form={form}
      >
        <Row gutter={[20, 25]}>
          <Col span={12}>
            <Form.Item<
              IIndividualpartyCharacteristic | IOrganizationpartyCharacteristic
            >
              name="characteristicName"
              label={t(messages.name)}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[{ required: true, message: t(messages.nameValidation) }]}
            >
              <Select
                showSearch
                placeholder={t(messages.placeholder)}
                className="w-full"
                optionFilterProp="children"
                onChange={handleChange}
                disabled={isEdit}
                options={options}
                filterOption={(input, option) =>
                  (option?.value ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                // size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>{selectCodition()}</Col>
          <Col span={24}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-primary text-white"
              >
                {t(messages.done)}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default PartyCharacteristicForm;
