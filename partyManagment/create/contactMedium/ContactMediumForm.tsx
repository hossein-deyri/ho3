import { Provinces } from "@/constants/Provinces";
import { useSelectProvince } from "@/tools/hooks/use-select-province";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import messages from "./messages";

//datepicker
import dayjs from "dayjs";
import CustomDatePicker from "@/components/pure-elements/customDatePicker";
import { convertToEn } from "@/tools/pure-function/persianToEnglish";
import moment from "jalali-moment";

//components
import VerificationModal from "@/components/pure-elements/verificationModal/VerificationModal";
import FormDynamicRenderer from "@/components/dynamic-render/Form-Render-Component/Form/Form";
import FormElement from "@/components/dynamic-render/Form-Render-Component/Form/FormElement";
import { Button, Col, Form, Input, Select, Space } from "antd";
import ContactMediumFormUnits from "./formUnits/formUnits";

//types
import { CONTACT_TYPES } from "@/types/enum/partyManagement";
import { FORM_COMPONENTS } from "@/types/enum/formComponents";

//api
import { IndividualVerificationService } from "@/pages/partyManagment/IndividualParty/api";
import { useMutation } from "@tanstack/react-query";
import { OrganizationVerificationService } from "@/pages/partyManagment/organizationParty/api";

//redux
import { useDispatch } from "react-redux";
import {
  addMediumContact,
  editContactMedium,
} from "@/redux/slices/partyManagment/individualParty.Slice";
import {
  addMediumContact as addMediumContactOrg,
  editContactMedium as editContactMediumOrg,
} from "@/redux/slices/partyManagment/organizationParty.slice";
import { useAppSelector } from "@/redux/hooks";
import {
  IContactMediumObject,
  IEmail,
  IPhoneNumber,
  IPostalAddress,
} from "@/types/model/redux/individualParty";
import { Countries } from "@/types/enum/countries";
import { TellPrefix } from "@/constants/tellPrefix";
import { AddonAfterStyle } from "@/assets/style/addonAfter/style";

interface Iprops {
  onClose: () => void;
  editContact?: IEmail | IPhoneNumber | IPostalAddress;
  isOrganization?: boolean;
  isEdit?: boolean;
  prefixValue: string | null;
  setPrefixValue: Dispatch<SetStateAction<string | null>>;
}

const individualVerificationServices = new IndividualVerificationService();
const organizationVerificationServices = new OrganizationVerificationService();

const ContactMediumForm = (props: Iprops) => {
  const {
    onClose,
    editContact,
    isOrganization,
    isEdit,
    prefixValue,
    setPrefixValue,
  } = props;
  const [contactType, setContactType] = useState<CONTACT_TYPES | string>(
    editContact?.mediumType || CONTACT_TYPES.EMAIL_ADDRESS
  );
  const [endDateTime, setEndDateTime] = useState<string | Date>(
    dayjs().format("YYYY-MM-DD")
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [contactValues, setContactValues] = useState<IContactMediumObject>();
  const [verifyCode, setVerifyCode] = useState<string>("");
  const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const { Option } = Select;
  const dispatch = useDispatch();
  const party = useAppSelector(
    isOrganization
      ? (state) => state.organizationParty
      : (state) => state.individualParty
  );
  const { lang } = useAppSelector((state) => state.lang);
  const { t } = useTranslation();
  const { filteredDistricts, handleSelectProvince, privinceCode } =
    useSelectProvince();
  const [form] = Form.useForm();
  const [isDisableCity, setIsDisableCity] = useState<boolean>(true);
  const [isEditDisableCity, setIsEditDisableCity] = useState<boolean>(false);

  const handleSelectCountry = (selectedCountry: Countries) => {
    form.setFieldsValue({
      city: null,
      stateOrProvince: null,
    });
    form.resetFields(["city"]);
    if (selectedCountry === "IRAN") {
      setIsDisableCity(false);
      setIsEditDisableCity(false);
      form.resetFields(["city"]);
      form.setFieldsValue({
        city: null,
      });
    } else {
      setIsDisableCity(true);
      setIsEditDisableCity(true);
      form.resetFields(["city"]);
      form.setFieldsValue({
        city: null,
      });
    }
  };

  const handleSelectCity = () => {
    form.setFieldsValue({
      stateOrProvince: null,
    });
  };

  useEffect(() => {
    if (lang) {
      // Set persianEndDate
      const persianEndDateTime = new Date(
        editContact?.validFor?.endDateTime || endDateTime
      ).toLocaleDateString("fa-IR");

      setEndDateTime(persianEndDateTime);
    } else {
      setEndDateTime(
        dayjs(editContact?.validFor?.endDateTime || endDateTime).format(
          "YYYY-MM-DD"
        )
      );
    }
  }, [party]);

  const tellPrefixList = (
    <Form.Item className="prefix-section" name="prefix">
      <Select placeholder="021" onChange={(value) => setPrefixValue(value)}>
        {TellPrefix.map((item) => (
          <Option value={item.value}>{item.value}</Option>
        ))}
      </Select>
    </Form.Item>
  );

  const initialValues: any = {
    ContactMediumType: editContact?.mediumType,
    endDate: dayjs(editContact?.validFor?.endDateTime || null, "YYYY-MM-DD"),
    prefix: prefixValue,
  };

  if (editContact?.characteristic) {
    if ("emailAddress" in editContact.characteristic) {
      initialValues["emailAddress"] = editContact?.characteristic?.emailAddress;
    }
    if ("phoneNumber" in editContact.characteristic) {
      if (isOrganization) {
        initialValues["phoneNumber"] =
          editContact?.characteristic?.phoneNumber?.slice(3);
      } else {
        initialValues["phoneNumber"] = editContact?.characteristic?.phoneNumber;
      }
    }
    if ("city" in editContact.characteristic) {
      (initialValues["city"] = editContact?.characteristic?.city),
        (initialValues["postalCode"] = editContact?.characteristic?.postcode),
        (initialValues["stateOrProvince"] =
          editContact?.characteristic?.stateOrProvince),
        (initialValues["addressLine1"] = editContact?.characteristic?.street1),
        (initialValues["addressLine2"] = editContact?.characteristic?.street2);
    }
    if ("country" in editContact.characteristic) {
      initialValues["country"] = editContact.characteristic?.country;
    }
  }

  const contactInformationFormItems = [
    {
      component: FORM_COMPONENTS.SELECT,
      label: t(messages.contactMediumType),
      name: "ContactMediumType",
      key: 23,
      colSpan: 12,
      children: (
        <>
          {Object.values(CONTACT_TYPES).map((value) => (
            <Option value={value} key={value}>
              {value === CONTACT_TYPES.EMAIL_ADDRESS
                ? t(messages.email)
                : value === CONTACT_TYPES.PHONE_NUMBER
                  ? (isOrganization ? t(messages.tellNumber) : t(messages.phoneNumber))
                  : t(messages.postalAddress)
              }
            </Option>
          ))}
        </>
      ),
      propChildren: {
        defaultValue: CONTACT_TYPES.EMAIL_ADDRESS,
        onChange: (value: any) => {
          setContactType(value);
        },
      },
    },
  ];

  const handleRenderContactForm = () => {
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
            label:isOrganization ? t(messages.tellNumber) : t(messages.phoneNumber) ,
            name: "phoneNumber",
            key: 1,
            labelCol: { span: 24 },
            wrapperCol: { span: 24 },
            colSpan: 12,
            // rules: [
            //   { required: true, message: t(messages.pleaseEnterPhoneNumber) },
            //   {
            //     pattern: new RegExp("^(\\+98|0)?9\\d{9}$"),
            //     message: t(messages.pleaseEnterPhoneNumber),
            //   },
            // ],
            propChildren: {
              className: "tell-input",
              placeholder: t(messages.phoneNumberPlaceHolder),
              addonAfter: isOrganization && tellPrefixList,
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
              disabled: isEdit ? isEditDisableCity : isDisableCity,
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
              disabled: isEdit ? isEditDisableCity : !privinceCode,
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

  const handleSubmitForm = async (values: any) => {
    const finalValues: {
      contactMedium: Array<IEmail | IPhoneNumber | IPostalAddress>;
    } = { contactMedium: [] };
    switch (contactType) {
      case CONTACT_TYPES.EMAIL_ADDRESS:
        finalValues.contactMedium.push({
          id: uuidv4(),
          mediumType: "email",
          characteristic: {
            emailAddress: values.emailAddress,
          },
          validFor: {
            endDateTime: lang
              ? moment(convertToEn(endDateTime), "jYYYY/jM/jD").format(
                "YYYY-MM-DD"
              )
              : endDateTime,
          },
          status: "PENDING",
        });
        break;
      case CONTACT_TYPES.PHONE_NUMBER:
        finalValues.contactMedium.push({
          id: uuidv4(),
          mediumType: CONTACT_TYPES.PHONE_NUMBER,
          characteristic: {
            phoneNumber: isOrganization
              ? values.prefix + values.phoneNumber
              : values.phoneNumber,
          },
          validFor: {
            endDateTime: lang
              ? moment(convertToEn(endDateTime), "jYYYY/jM/jD").format(
                "YYYY-MM-DD"
              )
              : endDateTime,
          },
          status: "PENDING",
        });
        break;
      case CONTACT_TYPES.POSTAL_ADDRESS:
        finalValues.contactMedium.push({
          id: uuidv4(),
          mediumType: "postalAddress",
          characteristic: {
            city:
              typeof values.city === "number"
                ? Provinces.find((item) => item.code === values.city)?.title
                : values.city,
            stateOrProvince:
              typeof values.stateOrProvince === "number"
                ? filteredDistricts.find(
                  (item) => item.code === values.stateOrProvince
                )?.title
                : values.stateOrProvince,
            country: values.country,
            postcode: values.postalCode,
            street1: values.addressLine1,
            street2: values.addressLine2,
          },
          validFor: {
            startDateTime: moment(values.startDate).format("YYYY-MM-DD"),
            endDateTime: moment(values.endDate).format("YYYY-MM-DD"),
          },
          status: "PENDING",
        });
        break;
      default:
        break;
    }

    setContactValues({ ...finalValues.contactMedium[0], id: party.id });

    if (party.id && !editContact) {
      try {
        onClose();
        dispatch(
          isOrganization
            ? addMediumContactOrg(finalValues.contactMedium)
            : addMediumContact(finalValues.contactMedium)
        );
      } catch (err) { }
    } else {
      dispatch(
        isOrganization
          ? editContactMediumOrg({
            contact: finalValues.contactMedium[0],
            id: editContact?.id,
          })
          : editContactMedium({
            contact: finalValues.contactMedium[0],
            id: editContact?.id,
          })
      );
      onClose();
    }
  };

  const verifyCodeMutate = useMutation({
    mutationFn: ({
      contact,
      code,
    }: {
      contact: IContactMediumObject;
      code: string;
    }) => {
      let contactMedium = {
        preferred: true,
        mediumType: contact.mediumType,
        validFor: contact.validFor,
        characteristic: contact.characteristic,
      };
      if (isOrganization) {
        return organizationVerificationServices.updatePatch(
          {
            // code: code,
            code: "136025",
            contactMedium,
          },
          contact.id || " ",
          {
            action: "verification",
          }
        );
      } else {
        return individualVerificationServices.updatePatch(
          {
            // code: code,
            code: "136025",
            contactMedium,
          },
          contact.id || "",
          {
            action: "verification",
          }
        );
      }
    },
    onSuccess: () => {
      setHasError(false);
      setOpenModal(false);
      setOpenSuccessModal(true);
    },
    onError: (error: any) => {
      setHasError(true);
    },
  });

  const handleCheckCode = async (finalCode: string) => {
    verifyCodeMutate.mutate({
      contact: {},
      code: finalCode,
    });
  };

  return (
    <>
      <VerificationModal
        open={openModal}
        setOpen={setOpenModal}
        hasError={hasError}
        setCode={setVerifyCode}
        openSuccessModal={openSuccessModal}
        setOpenSuccessModal={setOpenSuccessModal}
        modalTitle={
          contactType == CONTACT_TYPES.EMAIL_ADDRESS
            ? t(messages.emailVerification)
            : t(messages.mobileVerification)
        }
        modalContent={
          contactType == CONTACT_TYPES.EMAIL_ADDRESS
            ? t(messages.pleaseCheckYourEmail)
            : t(messages.pleaseCheckYourMobile)
        }
        handlerVerification={handleCheckCode}
      />
      <AddonAfterStyle>
        <FormDynamicRenderer
          scrollToFirstError={true}
          name="basic"
          labelAlign="left"
          labelWrap={false}
          size="middle"
          onFinish={handleSubmitForm}
          layout={"vertical"}
          justify={"start"}
          align={"top"}
          gutter={[20, 25]}
          onValuesChange={() => { }}
          initialValues={editContact ? initialValues : {}}
          form={form}
        >
          {contactInformationFormItems.map((unit) => (
            <FormElement {...unit} />
          ))}
          {/* {ContactMediumFormUnits({ t, contactType, form }).map((unit, i) => ( */}
          {handleRenderContactForm().map((unit, i) => (
            <>
              <FormElement {...unit} />
            </>
          ))}
          <div className="flex w-full">
            <Col span={12}>
              <CustomDatePicker
                label={t(messages.endDateTime)}
                name={t(messages.endDateTime)}
                value={endDateTime}
                onChangeDate={setEndDateTime}
                width="100%"
                minDate={new Date()}
                maxDate=""
              />
            </Col>
          </div>
          <Col>
            <Button
              type="primary"
              className="flex items-center bg-primary"
              htmlType="submit"
            >
              {t(messages.done)}
            </Button>
          </Col>
        </FormDynamicRenderer>
      </AddonAfterStyle>
    </>
  );
};

export default ContactMediumForm;
