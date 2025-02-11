import { FormElementProps } from "@/components/dynamic-render/Form-Render-Component/Form/types";
import { FORM_COMPONENTS } from "@/types/enum/formComponents";
import { Select } from "antd";
import { TFunction } from "i18next";
import messages from "../../messages";
import { IOrganizationPartyConstants } from "@/types/model/entity/organizationParty.model";
import { useAppSelector } from "@/redux/hooks";
const { Option } = Select;

interface Props {
  t: TFunction<"translation", undefined>;
  organizationTypeData: IOrganizationPartyConstants[] | undefined;
  nameType: any;
}

export const MainInfoUnit = (props: Props): FormElementProps[] => {
  const { t, organizationTypeData, nameType } = props;
  const organizationParty = useAppSelector((state) => state.organizationParty);

  return [
    {
      component: FORM_COMPONENTS.INPUT,
      label: t(messages.tradingName),
      name: "tradingName",
      key: 16,
      colSpan: 12,
      children: <></>,
      propChildren: {
        placeholder: t(messages.tradingNamePlaceholder),
      },
      rules: [
        {
          required: true,
          message: t(messages.pleaseEntertradingName),
        },
      ],
    },
    {
      component: FORM_COMPONENTS.SELECT,
      label: t(messages.organizationType),
      name: "organizationType",
      key: 12,
      children: (
        <>
          {organizationTypeData?.map((item) => (
            <Option value={item.name} key={item.id}>
              {item.name}
            </Option>
          ))}
        </>
      ),
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 12,
      rules: [
        { type: "text", message: "important " },
        {
          //   required: individualParty?.familyName ? false : true,
          message: "important",
        },
      ],
      propChildren: {
        defaultValue: organizationParty?.organizationType,
        placeholder: t(messages.organizationTypePlaceholder),
      },
    },
    {
      component: FORM_COMPONENTS.INPUT,
      label: t(messages.name),
      name: "name",
      key: 16,
      colSpan: 12,
      children: <></>,
      propChildren: {
        defaultValue: organizationParty?.name || "",
        placeholder: t(messages.namePlaceholder),
      },
    },
    {
      component: FORM_COMPONENTS.SELECT,
      label: t(messages.nameType),
      name: "nameType",
      key: 20,
      colSpan: 12,
      children: (
        <>
          {nameType?.map((item: any) => (
            <Option value={item.name} key={item.id}>
              {item.name}
            </Option>
          ))}
        </>
      ),
      propChildren: {
        defaultValue: organizationParty?.nameType || "inc",
        // disabled: true,
        placeholder: t(messages.namePlaceholder),
      },
    },
    {
      component: FORM_COMPONENTS.CHECK_BOX,
      label: t(messages.isLegalEntity),
      valuePropName: "checked",
      name: "isLegalEntity",
      key: 10,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 6,
      rules: [
        { type: "text", message: "important " },
        // {
        // required: organizationParty?. ? false : true,
        //   message: "important",
        // },
      ],
      propChildren: {
        // value: organizationParty?.isLegalEntity,
        defaultValue: organizationParty?.isLegalEntity,
        placeholder: t("givenNamePlaceHolder"),
      },
    },
    {
      component: FORM_COMPONENTS.CHECK_BOX,
      label: t(messages.isHeadOffice),
      valuePropName: "checked",
      name: "isHeadOffice",
      key: 11,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 6,
      rules: [
        // { type: "text", message: "important " },
        { required: false, message: "important" },
      ],
      propChildren: {
        // value: individualParty?.middleName,
        // placeholder: t("middleNamePlaceHolder"),
        defaultValue: organizationParty?.isHeadOffice,
      },
    },
  ];
};

export const OtherNameFormUnits = (props: Props): FormElementProps[] => {
  const { t, nameType } = props;
  const organizationParty = useAppSelector((state) => state.organizationParty);

  return [
    {
      component: FORM_COMPONENTS.SELECT,
      label: t(messages.nameType),
      name: "otherNameNameType",
      key: 20,
      colSpan: 8,
      children: (
        <>
          {nameType?.map((item: any) => (
            <Option value={item.name} key={item.id}>
              {item.name}
            </Option>
          ))}
        </>
      ),
      propChildren: {
        defaultValue: organizationParty?.otherName?.nameType || "inc",
        placeholder: t(messages.namePlaceholder),
      },
    },
    {
      component: FORM_COMPONENTS.INPUT,
      label: t(messages.tradingName),
      name: "otherNameTradingName",
      key: 16,
      colSpan: 8,
      children: <></>,
      propChildren: {
        defaultValue: organizationParty?.otherName?.tradingName || "",
        // disabled: true,
        placeholder: t(messages.tradingNamePlaceholder),
      },
    },
    {
      component: FORM_COMPONENTS.INPUT,
      label: t(messages.name),
      name: "otherNameName",
      key: 16,
      colSpan: 8,
      children: <></>,
      propChildren: {
        defaultValue: organizationParty?.otherName?.name || "",
        // disabled: true,
        placeholder: t(messages.namePlaceholder),
      },
    },
  ];
};
