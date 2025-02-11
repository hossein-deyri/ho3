import { FORM_COMPONENTS } from "@/types/enum/formComponents";
import { useTranslation } from "react-i18next";
import { messages } from "../../messages";
import { Select } from "antd";

//api
import { SpecificationServices } from "@/pages/productManagment/specification/api";
import { useQuery } from "@tanstack/react-query";
import { ProductOfferingServices } from "@/pages/productManagment/productOffering/api";

const { Option } = Select;

interface Props {}

const specificationServices = new SpecificationServices();
const offeringServices = new ProductOfferingServices();

export const ProductOrderingFormUnits = (props: Props) => {
  const {} = props;
  const { t } = useTranslation();

  //get specification list
  const { data: specificationData } = useQuery({
    queryKey: ["specifications"],
    queryFn: async () => {
      const data = await specificationServices.getList({});
      return data.data;
    },
  });

  //get offering list
  const { data: offeringData } = useQuery({
    queryKey: ["productOffering"],
    queryFn: async () => {
      const data = await offeringServices.getList({});
      return data.data;
    },
  });

  const bilingArray = [
    {
      key: 0,
      value: "test",
    },
    {
      key: 1,
      value: "test",
    },
    {
      key: 2,
      value: "test",
    },
  ];

  const priceType = [
    {
      key: 0,
      value: "nonRecurring",
    },
    {
      key: 1,
      value: "Recurring",
    },
  ];

  const periodType = [
    {
      key: 0,
      value: "Monthly",
    },
    {
      key: 1,
      value: "Weekly",
    },
  ];

  const priceUnits = [
    {
      key: 0,
      value: "EUR",
    },
    {
      key: 1,
      value: "Rial",
    },
  ];

  return [
    {
      component: FORM_COMPONENTS.SELECT,
      label: t(messages.billingAccount),
      name: "billingAccount",
      key: 0,
      labelCol: { span: 24 },
      wrapperCol: { span: 12 },
      colSpan: 24,
      rules: [{ required: true, message: t(messages.billingAccountValidation) }],
      children: (
        <>
          {bilingArray.map((item) => (
            <Option key={item.key} value={item.value}>
              {item.value}
            </Option>
          ))}
        </>
      ),
      propChildren: {
        placeholder: t(messages.billingAccountPlaceHolder),
      },
    },
    {
      component: FORM_COMPONENTS.INPUT,
      label: t(messages.name),
      name: "characteristicName",
      key: 1,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 12,
      rules: [{ required: true, message: t(messages.nameValidation) }],
      propChildren: {
        placeholder: t(messages.namePlaceHolder),
      },
    },
    {
      component: FORM_COMPONENTS.INPUT,
      label: t(messages.value),
      name: "characteristicValue",
      key: 2,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 12,
      rules: [{ required: true, message: t(messages.valueValidation) }],
      propChildren: {
        placeholder: t(messages.valuePlaceHolder),
      },
    },
    {
      component: FORM_COMPONENTS.SELECT,
      label: t(messages.productSpecification),
      name: "productSpecification",
      key: 3,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 12,
      rules: [{ required: true, message: t(messages.productSpecificationValidation) }],
      children: (
        <>
          {specificationData?.map((item) => (
            <Option key={item.id} value={item.name}>
              {item.name}
            </Option>
          ))}
        </>
      ),
      propChildren: {
        placeholder: t(messages.productSpecificationPlaceHolder),
      },
    },
    {
      component: FORM_COMPONENTS.SELECT,
      label: t(messages.productOffer),
      name: "productOffering",
      key: 4,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 12,
      rules: [{ required: true, message: t(messages.productOfferValidation) }],
      children: (
        <>
          {offeringData?.map((item) => (
            <Option key={item.id} value={item.name}>
              {item.name}
            </Option>
          ))}
        </>
      ),
      propChildren: {
        placeholder: t(messages.productOfferPlaceHolder),
      },
    },
    {
      component: FORM_COMPONENTS.SELECT,
      label: t(messages.priceType),
      name: "priceType",
      key: 5,
      labelCol: { span: 24 },
      wrapperCol: { span: 12 },
      colSpan: 24,
      rules: [{ required: true, message: t(messages.priceTypeValidation) }],
      children: (
        <>
          {priceType.map((item) => (
            <Option key={item.key} value={item.value}>
              {item.value}
            </Option>
          ))}
        </>
      ),
      propChildren: {
        placeholder: t(messages.priceTypePlaceHolder),
      },
    },
    {
      component: FORM_COMPONENTS.SELECT,
      label: t(messages.units),
      name: "dutyUnits",
      key: 6,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 12,
      rules: [{ required: true, message: t(messages.unitsValidation) }],
      children: (
        <>
          {priceUnits.map((item) => (
            <Option key={item.key} value={item.value}>
              {item.value}
            </Option>
          ))}
        </>
      ),
      propChildren: {
        placeholder: t(messages.unitsPlaceHolder),
      },
    },
    {
      component: FORM_COMPONENTS.INPUT,
      label: t(messages.value),
      name: "dutyValue",
      key: 7,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 12,
      rules: [{ required: true, message: t(messages.valueValidation) }],
      propChildren: {
        placeholder: t(messages.valuePlaceHolder),
      },
    },
    {
      component: FORM_COMPONENTS.SELECT,
      label: t(messages.units),
      name: "taxUnits",
      key: 8,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 12,
      rules: [{ required: true, message: t(messages.unitsValidation) }],
      children: (
        <>
          {priceUnits.map((item) => (
            <Option key={item.key} value={item.value}>
              {item.value}
            </Option>
          ))}
        </>
      ),
      propChildren: {
        placeholder: t(messages.unitsPlaceHolder),
      },
    },
    {
      component: FORM_COMPONENTS.INPUT,
      label: t(messages.value),
      name: "taxValue",
      key: 9,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 12,
      rules: [{ required: true, message: t(messages.valueValidation) }],
      propChildren: {
        placeholder: t(messages.valuePlaceHolder),
      },
    },
    {
      component: FORM_COMPONENTS.INPUT,
      label: t(messages.name),
      name: "termName",
      key: 10,
      labelCol: { span: 24 },
      wrapperCol: { span: 12 },
      colSpan: 24,
      rules: [{ required: true, message: t(messages.periodValidation) }],
      propChildren: {
        placeholder: t(messages.periodPlaceHolder),
      },
    },
    {
      component: FORM_COMPONENTS.SELECT,
      label: t(messages.units),
      name: "durationUnits",
      key: 12,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 12,
      rules: [{ required: true, message: t(messages.timeValidation) }],
      children: (
        <>
          {periodType.map((item) => (
            <Option key={item.key} value={item.value}>
              {item.value}
            </Option>
          ))}
        </>
      ),
      propChildren: {
        placeholder: t(messages.timePlaceHolder),
      },
    },
    {
      component: FORM_COMPONENTS.INPUT,
      label: t(messages.amount),
      name: "durationAmount",
      key: 11,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 12,
      rules: [{ required: true, message: t(messages.amountValidation) }],
      propChildren: {
        placeholder: t(messages.amountPlaceHolder),
      },
    },
  
  ];
};
export default ProductOrderingFormUnits;
