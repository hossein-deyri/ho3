import { FORM_COMPONENTS } from "@/types/enum/formComponents";
import { CONTACT_TYPES } from "@/types/enum/partyManagement";
import messages from "../messages";
import { TFunction } from "i18next";
import { Countries } from "@/types/enum/countries";
import { FormInstance, Select } from "antd";
import { useState } from "react";
import { Provinces } from "@/constants/Provinces";

//hooks
import { useSelectProvince } from "@/tools/hooks/use-select-province";

interface pageProps {
  contactType: string;
  t: TFunction<"translation", undefined>;
  form: FormInstance<any>;
}

const ContactMediumFormUnits = (props: pageProps) => {
  const { t, contactType, form } = props;
  const { Option } = Select;
  const { filteredDistricts, handleSelectProvince, privinceCode } =
    useSelectProvince();
  const [isDisableCity, setIsDisableCity] = useState<boolean>(true);

  const handleSelectCountry = (selectedCountry: Countries) => {
      form.setFieldsValue({
        city: null,
        stateOrProvince: null,
      });
      form.resetFields(["city"]);
    if (selectedCountry === "IRAN") {
      setIsDisableCity(false);
    } else {
      setIsDisableCity(true);
    }
  };

  const handleSelectCity=()=>{
    form.setFieldsValue({
        stateOrProvince: null,
      });
  }

  let finalForm;
  switch (contactType) {
    case CONTACT_TYPES.EMAIL_ADDRESS:
      finalForm = [
        {
          component: FORM_COMPONENTS.INPUT,
          label: t(messages.EMAIL_ADDRESS),
          name: "emailAddress",
          key: 0,
          labelCol: { span: 24 },
          wrapperCol: { span: 24 },
          colSpan: 12,
          rules: [
            { type: "email", message: t(messages.pleaseEnterValidEmail) },
            { required: true, message: t(messages.pleaseEnterValidEmail) },
          ],
          propChildren: {
            placeholder: t(messages.emailPlaceholder),
          },
        },
      ];
      break;
    case CONTACT_TYPES.PHONE_NUMBER:
      finalForm = [
        {
          component: FORM_COMPONENTS.INPUT,
          label: t(messages.phoneNumber),
          name: "phoneNumber",
          key: 1,
          labelCol: { span: 24 },
          wrapperCol: { span: 24 },
          colSpan: 12,
          rules: [
            { required: true, message: t(messages.pleaseEnterPhoneNumber) },
            {
              pattern: new RegExp("^(\\+98|0)?9\\d{9}$"),
              message: t(messages.pleaseEnterPhoneNumber),
            },
          ],
          propChildren: {
            placeholder: t(messages.phoneNumberPlaceHolder),
          },
        },
      ];
      break;
    case CONTACT_TYPES.POSTAL_ADDRESS:
      finalForm = [
        {
          component: FORM_COMPONENTS.SELECT,
          label: t(messages.country),
          name: "country",
          key: 3,
          labelCol: { span: 24 },
          wrapperCol: { span: 24 },
          colSpan: 12,
          children: (
            <>
              {Object.values(Countries).map((item) => (
                <Option key={item} value={item}>
                  {t(messages[item])}
                </Option>
              ))}
            </>
          ),
          propChildren: {
            onChange: (value: Countries) => handleSelectCountry(value),
            placeholder: t(messages.titlePlaceHolder),
          },
        },
        {
          component: FORM_COMPONENTS.SELECT,
          label: t(messages.city),
          name: "city",
          key: 4,
          colSpan: 12,
          children: (
            <>
              {Provinces.map((value) => (
                <Option
                  value={value.code}
                  key={value.code}
                  data-code={value.code}
                >
                  {t(value.title)}
                </Option>
              ))}
            </>
          ),
          propChildren: {
            onChange: (e: any) => {
                handleSelectCity();  
              handleSelectProvince(e);
            },
            placeholder: t(messages.titlePlaceHolder),
            disabled: isDisableCity,
          },
        },
        {
          component: FORM_COMPONENTS.SELECT,
          label: t(messages.stateOrProvince),
          name: "stateOrProvince",
          key: 5,
          colSpan: 12,
          children: (
            <>
              {filteredDistricts.map((value) => (
                <Option
                  value={value.code}
                  key={value.code}
                  data-code={value.code}
                >
                  {t(value.title)}
                </Option>
              ))}
            </>
          ),
          propChildren: {
            //   defaultValue:"iranian",
            disabled: !privinceCode,
            placeholder: t(messages.titlePlaceHolder),
          },
        },
        {
          component: FORM_COMPONENTS.INPUT,
          label: t(messages.postalCode),
          name: "postalCode",
          key: 6,
          labelCol: { span: 24 },
          wrapperCol: { span: 24 },
          colSpan: 12,
          rules: [
            { type: "text", message: "important " },
            {
              required: true,
              pattern: /^\d{10}$/,
              message: t(messages.postCodePlaceholder),
            },
          ],
          propChildren: {
            placeholder: t(messages.postalCodePlaceHoder),
          },
        },
        {
          component: FORM_COMPONENTS.INPUT,
          label: t(messages.addressLine1),
          name: "addressLine1",
          key: 7,
          labelCol: { span: 24 },
          wrapperCol: { span: 24 },
          colSpan: 24,
          rules: [
            { type: "text", message: "important " },
            { required: false, message: "important" },
          ],
          propChildren: {
            placeholder: "",
          },
        },
        {
          component: FORM_COMPONENTS.INPUT,
          label: t(messages.addressLine2),
          name: "addressLine2",
          key: 8,
          labelCol: { span: 24 },
          wrapperCol: { span: 24 },
          colSpan: 24,
          rules: [
            { type: "text", message: "important " },
            { required: false, message: "important" },
          ],
          propChildren: {
            placeholder: "",
          },
        },
      ];
      break;

    default:
      finalForm = [
        {
          component: FORM_COMPONENTS.INPUT,
          label: t(messages.EMAIL_ADDRESS),
          name: "emailAddress",
          key: 9,
          labelCol: { span: 24 },
          wrapperCol: { span: 24 },
          colSpan: 12,
          rules: [
            { type: "text", message: "important " },
            { required: false, message: "important" },
          ],

          propChildren: {
            placeholder: t(messages.emailPlaceholder),
          },
        },
      ];
      break;
  }
  return finalForm;
};

export default ContactMediumFormUnits;
