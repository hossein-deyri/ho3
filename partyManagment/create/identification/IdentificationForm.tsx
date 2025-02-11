import FormDynamicRenderer from "@/components/dynamic-render/Form-Render-Component/Form/Form";
import FormElement from "@/components/dynamic-render/Form-Render-Component/Form/FormElement";
import UploadFile from "@/components/pure-elements/upload";
import { ACCEPT_ENUMS } from "@/types/enum/acceptInput";
import { END_POINTS } from "@/types/enum/endPoints";
import { IDENTIFICATION_TYPE } from "@/types/enum/partyManagement";
import {
  IAttachment,
  IndividualIdentification,
} from "@/types/model/redux/individualParty";
import { useAppDispatch } from "@/redux/hooks";
import {
  addIdentification as addIndividualIdentification,
  editIdentification as editIndividualIdentification,
} from "@/redux/slices/partyManagment/individualParty.Slice";
import { Button, Col, Select } from "antd";
import moment from "jalali-moment";
import dayjs from "dayjs";
import CustomDatePicker from "../../../../components/pure-elements/customDatePicker/index";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/redux/hooks";
import { convertToEn } from "@/tools/pure-function/persianToEnglish";
import { FORM_COMPONENTS } from "@/types/enum/formComponents";
import { IOrganizationIdentification } from "@/types/model/redux/organizationParty";
import {
  addIdentification as addOrganizationIdentification,
  editIdentification as editOrganizationIdentification,
} from "@/redux/slices/partyManagment/organizationParty.slice";
import { IDENTIFICATION_ORGANIZATION_TYPE } from "@/types/enum/partyManagement";

import messages from "./messages";
const { Option } = Select;

interface IProps {
  onClose: () => void;
  isOrganization?: boolean;
  isEdit: boolean;
  editItem?: IOrganizationIdentification | IndividualIdentification;
}

const IdentificationForm = (props: IProps) => {
  const { onClose, isOrganization, isEdit, editItem } = props;
  // const fileUrls: any = [];
  // if (editItem) {
  //   if (editItem.attachment) {
  //     editItem.attachment.map((item) => {
  //       fileUrls.push(item.url);
  //     });
  //   }
  // }

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const individualParty = useAppSelector((state) => state.individualParty);
  const organizationParty = useAppSelector((state) => state.organizationParty);

  const [files, setFiles] = useState({});
  const [ids, seIds] = useState<string>();
  const [selectedIdentificationType, setSelectedIdentificationType] =
    useState<string>("");
  const [attachments, setAttachments] = useState<IAttachment[]>([]);
  const [values, setValues] = useState<any>({});
  const { lang } = useAppSelector((state) => state.lang);

  const [startDateTime, setStartDateTime] = useState<string | Date>(
    dayjs().format("YYYY-MM-DD")
  );
  const [endDateTime, setEndDateTime] = useState<string | Date>(
    dayjs().format("YYYY-MM-DD")
  );
  const [issuingDate, setIssuingDate] = useState<string | Date>(
    dayjs().format("YYYY-MM-DD")
  );

  const handleSubmit = (values: any) => {
    const finalValues: IndividualIdentification | IOrganizationIdentification =
    {
      identificationType: values.identificationType,
      identificationId: values.identificationId,
      issuingAuthority: values.issuingAuthority,
      issuingDate: lang
        ? moment(convertToEn(issuingDate), "jYYYY/jM/jD").format("YYYY-MM-DD")
        : issuingDate,

      validFor: {
        startDateTime: lang
          ? moment(convertToEn(startDateTime), "jYYYY/jM/jD").format(
            "YYYY-MM-DD"
          )
          : startDateTime,

        endDateTime: lang
          ? moment(convertToEn(endDateTime), "jYYYY/jM/jD").format(
            "YYYY-MM-DD"
          )
          : endDateTime,
      },
    };
    if (isOrganization) {
      if (!isEdit) {
        dispatch(
          addOrganizationIdentification({
            ...finalValues,
            attachment: attachments,
          })
        );
      } else {
        dispatch(
          editOrganizationIdentification({
            identification: {
              ...finalValues,
              attachment: editItem?.attachment,
            },
            id: editItem?.id,
          })
        );
      }
    } else {
      if (!isEdit) {
        dispatch(
          addIndividualIdentification({
            ...finalValues,
            attachment: attachments,
          })
        );
      } else {
        dispatch(
          editIndividualIdentification({
            identification: {
              ...finalValues,
              attachment: editItem?.attachment,
            },
            id: editItem?.id,
          })
        );
      }
    }
    onClose();
  };

  const initialValues: any = {
    identificationType: editItem?.identificationType,
    identificationId: editItem?.identificationId,
    issuingAuthority: editItem?.issuingAuthority,
    issuingDate: editItem?.issuingDate,
    startDateTime: dayjs(editItem?.validFor?.startDateTime),
    endDateTime: dayjs(editItem?.validFor?.endDateTime),
  };

  const contactInformationFormItems = [
    {
      component: FORM_COMPONENTS.SELECT,
      label: t(messages.identificationType),
      name: "identificationType",
      key: 1,
      colSpan: 12,
      rules: !isOrganization ? [{ required: true, message: t(messages.pleaseChooseIdentificationType) }] : [{ required: false, message: t(messages.pleaseChooseIdentificationType) }],


      children: !isOrganization ? (
        <>
          {Object.values(IDENTIFICATION_TYPE).map((value) => (
            <Option value={value} key={value}>
              {value === IDENTIFICATION_TYPE.NATIONAL_CARD
                ? t(messages.nationalCode)
                : t(messages.passport)}
            </Option>
          ))}
        </>
      ) : (
        <>
          {Object.values(IDENTIFICATION_ORGANIZATION_TYPE).map((value) => (
            <Option value={value} key={value}>
              {value ===
                IDENTIFICATION_ORGANIZATION_TYPE.COMMERCIAL_REGISTRATION &&
                t(messages.commercialRegistration)}
            </Option>
          ))}
        </>
      ),
      propChildren: {
        disabled: !isOrganization ? false : true,
        value: selectedIdentificationType,
        placeholder: !isOrganization ? t(messages.passport) : t(messages.commercialRegistration),

        onChange: (value: any) => setSelectedIdentificationType(value),
        // defaultValue: IDENTIFICATION_TYPE.NATIONAL_CARD,
      },
    },
    {
      component: FORM_COMPONENTS.INPUT,
      // label: t(messages.identificationId),
      label: !isOrganization ? (selectedIdentificationType === IDENTIFICATION_TYPE.NATIONAL_CARD ? t(messages.nationalCode) : t(messages.passport)) : t(messages.commercialRegistration),
      name: "identificationId",
      key: 2,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 12,
      rules:
        selectedIdentificationType === IDENTIFICATION_TYPE.NATIONAL_CARD
          ? [
            {
              required: true,
              pattern: /^\d{10}$/,
              message: t(messages.nationalCodeValidation),
            },
          ]
          : selectedIdentificationType === IDENTIFICATION_TYPE.PASSPORT
            ? [
              {
                required: true,
                pattern: /^[A-Z0-9]{6,12}$/,
                message: t(messages.passportValidation),
              },
            ]
            : [
              {
                required: true,
                pattern: /^\d{11}$/,
                message: t(messages.commercialRegistrationValidation),
              },
            ],
      propChildren: {
        placeholder: !isOrganization ? (selectedIdentificationType === IDENTIFICATION_TYPE.NATIONAL_CARD ? t(messages.nationalCodePlaceHolder) : t(messages.passportPlaceHolder)) : t(messages.commercialRegistrationPlaceHolder),
        maxLength:
          selectedIdentificationType === IDENTIFICATION_TYPE.NATIONAL_CARD
            ? 10
            : selectedIdentificationType === IDENTIFICATION_TYPE.NATIONAL_CARD
              ? 12
              : 11,
      },
    },
    {
      component: FORM_COMPONENTS.INPUT,
      label: t(messages.issuingAuthority),
      name: "issuingAuthority",
      key: 3,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colSpan: 12,
      rules: [
        { required: true, message: t(messages.pleaseEnterIssuingAuthority) },
      ],
      propChildren: {
        placeholder: t(messages.IssuingAuthorityPlaceHolder),
      },
    },
  ];

  useEffect(() => {
    if (lang) {
      // Set persianStartDate
      const persianStartDateTime = new Date(startDateTime).toLocaleDateString(
        "fa-IR"
      );

      setStartDateTime(persianStartDateTime);

      // Set persianEndDate
      const persianEndDateTime = new Date(endDateTime).toLocaleDateString(
        "fa-IR"
      );

      setEndDateTime(persianEndDateTime);

      // Set persianIssuingDate
      const persianIssuingDate = new Date(issuingDate).toLocaleDateString(
        "fa-IR"
      );

      setIssuingDate(persianIssuingDate);
    } else {
      setStartDateTime(dayjs(startDateTime).format("YYYY-MM-DD"));

      setEndDateTime(dayjs(endDateTime).format("YYYY-MM-DD"));

      setIssuingDate(dayjs(issuingDate).format("YYYY-MM-DD"));
    }
  }, [individualParty, organizationParty]);

  useEffect(() => {
    const newAttachment: IAttachment = {
      id: ids,
      href: `${import.meta.env.VITE_BASE_URL}/${END_POINTS.MEDIA_MANAGEMENT
        }/files/${ids}`,
      attachmentType: values?.value?.identificationType,
    };
    setAttachments((attachment) => [newAttachment]);
  }, [ids]);

  return (
    <FormDynamicRenderer
      scrollToFirstError={true}
      name="basic"
      labelAlign="left"
      labelWrap={false}
      size="middle"
      onFinish={handleSubmit}
      layout={"vertical"}
      justify={"start"}
      align={"top"}
      gutter={[20, 25]}
      initialValues={editItem ? initialValues : {}}
      onValuesChange={(value) =>
        setValues((prev: any) => {
          return { ...prev, value };
        })
      }
    >
      {contactInformationFormItems.map((unit) => (
        <FormElement {...unit} />
      ))}
      <Col span={12}>
        <CustomDatePicker
          label={t(messages.issuingDate)}
          name={t(messages.issuingDate)}
          value={issuingDate}
          onChangeDate={setIssuingDate}
          width="100%"
          minDate=""
          maxDate={new Date()}
        />
      </Col>
      <div className="flex w-full">
        <Col span={24}>
          {/* <CustomDatePicker
          label={t(messages.startDateTime)}
          name={t(messages.startDateTime)}
          value={startDateTime}
          onChangeDate={setStartDateTime}
          width="100%"
          minDate={new Date()}
          maxDate=""
        /> */}
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
      <UploadFile
        accept={ACCEPT_ENUMS.IMAGE}
        id="individualParty"
        name="attachment"
        url={END_POINTS.TUS_UPLOAD}
        setFiles={setFiles}
        value={files}
        width="100%"
        height="200px"
        isTusProtocol={true}
        setIDs={seIds}
        disabled={!values?.value?.identificationType}
      />
      <Button
        type="primary"
        className="flex items-center bg-primary"
        htmlType="submit"
      >
        {t(messages.done)}
      </Button>
    </FormDynamicRenderer>
  );
};

export default IdentificationForm;
