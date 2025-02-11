import { useState } from "react";
import { TFunction } from "i18next";
import messages from "../../messages";

//components
import { FormElementProps } from "@/components/dynamic-render/Form-Render-Component/Form/types";
import { FORM_COMPONENTS } from "@/types/enum/formComponents";
import { FormInstance, Select } from "antd";

//types
import { Provinces } from "@/constants/Provinces";
import { IindividualParty } from "@/types/model/redux/individualParty";
import { Countries } from "@/types/enum/countries";

interface Props {
  t: TFunction<"translation", undefined>;
  data: IindividualParty;
  form: FormInstance<any>;
}

export const mainInfoUnit = (props: Props): FormElementProps[] => {
  const { data, t, form } = props;
  const [country, setCountry] = useState<Countries | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const { Option } = Select;

  const handleSelectCountry = (selectedCountry: Countries) => {
    setCountry(selectedCountry);
    setCity(null);
    form.resetFields(["placeOfBirth"]);
    form.setFieldsValue({
      placeOfBirth: null,
    });
  };

  const handleSelectCity = (value: any) => {
    setCity(value);
  };

  return [
    {
      component: FORM_COMPONENTS.INPUT,
      label: t(messages.givenName),
      name: "givenName",
      key: 10,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 12,
      rules: [
        { type: "text", message: " important" },
        {
          required: true,
          message: t(messages.pleaseEnterFirstName),
        },
      ],
      propChildren: {
        placeholder: t(messages.givenNamePlaceHolder),
      },
    },
    {
      component: FORM_COMPONENTS.INPUT,
      label: t(messages.familyName),
      name: "familyName",
      key: 12,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 12,
      rules: [
        { type: "text", message: "important " },
        {
          required: true,
          message: t(messages.pleaseEnterFamilyName),
        },
      ],
      propChildren: {
        placeholder: t(messages.familyNamePlaceHolder),
      },
    },
    // {
    //   component: FORM_COMPONENTS.INPUT,
    //   label: t(messages.middleName),
    //   name: "middleName",
    //   key: 11,
    //   labelCol: { span: 24 },
    //   wrapperCol: { span: 24 },
    //   colSpan: 12,
    //   rules: [
    //     { type: "text", message: "important " },
    //     { required: false, message: "Please write MiddleName" },
    //   ],
    //   propChildren: {
    //     value: data?.middleName,
    //     placeholder: t(messages.middleNamePlaceHolder),
    //   },
    // },
    {
      component: FORM_COMPONENTS.INPUT,
      label: t(messages.fatherName),
      name: "aristocraticTitle",
      key: 10,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 12,
      rules: [
        { type: "text", message: " important" },
        {
          required: true,
          message: t(messages.pleaseEnterFatherName),
        },
      ],
      propChildren: {
        placeholder: t(messages.fatherNamePlaceHolder),
      },
    },
    // {
    //   component: FORM_COMPONENTS.INPUT,
    //   label: t(messages.familyNamePrefix),
    //   name: "familyNamePrefix",
    //   key: 13,
    //   labelCol: { span: 24 },
    //   wrapperCol: { span: 24 },
    //   colSpan: 12,
    //   rules: [
    //     { type: "text", message: "important " },
    //     { required: false, message: "important" },
    //   ],
    //   propChildren: {
    //     value: data?.familyNamePrefix,
    //     placeholder: t(messages.familyNamePrefixPlaceHolder),
    //   },
    // },
    {
      component: FORM_COMPONENTS.SELECT,
      label: t(messages.countryOfBirth),
      name: "countryOfBirth",
      key: 16,
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
        placeholder: t(messages.countryOfBirthPlaceHolder),

      },
    },
    {
      component: FORM_COMPONENTS.SELECT,
      label: t(messages.placeOfBirth),
      name: "placeOfBirth",
      key: 15,
      colSpan: 12,
      children: <></>,
      propChildren: {
        disabled: !country,
        placeholder: t(messages.placeOfBirthPlaceHolder),

        value: city,
        options:
          country === Countries.IRAN
            ? Provinces.map((item) => ({
                label: item.title,
                value: item.title,
              }))
            : country && t(messages[country])
            ? [
                {
                  label: t(messages[country]),
                  value: t(messages[country]),
                },
              ]
            : [],
        onChange: handleSelectCity,
        initialValue: city,
      },
    },
    {
      component: FORM_COMPONENTS.SELECT,
      label: t(messages.nationality),
      name: "nationality",
      key: 17,
      colSpan: 12,
      children: <></>,
      propChildren: {
        value: "Iranian",
        placeholder: t(messages.nationalityPlaceHolder),
        defaultValue: data?.nationality,
        options: [
          {
            value: "iranian",
            label: t(messages.iranian),
          },
          {
            value: "none-iranian",
            label: t(messages.noneIranian),
          },
        ],
      },
    },
    {
      component: FORM_COMPONENTS.SELECT,
      label: t(messages.title),
      name: "title",
      key: 18,
      colSpan: 12,
      children: (
        <>
          <Option value="Mr" key={"0"}>
            {t(messages.mr)}
          </Option>
          <Option value="Mrs" key={"1"}>
            {t(messages.mrs)}
          </Option>
        </>
      ),
      propChildren: {
        placeholder: t(messages.titlePlaceHolder),
        defaultValue: data?.title,
      },
    },
  ];
};
