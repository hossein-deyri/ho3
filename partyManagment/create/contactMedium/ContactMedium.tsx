import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import {
  // deleteForDeepCopy,
  removeKeyFromObjectArray,
} from "@/tools/pure-function/deleteFormDeepCopy";
import messages from "./messages";

//components
import StyledTable from "@/components/styledTable";
import { Button, Divider, Drawer, Space, Tag, message } from "antd";
import { ColumnsType } from "antd/es/table";
import ContactMediumForm from "./ContactMediumForm";
import VerificationModal from "@/components/pure-elements/verificationModal/VerificationModal";

//api
import { useMutation } from "@tanstack/react-query";
import {
  OrganizationVerificationService,
  organizationPartyServices,
} from "@/pages/partyManagment/organizationParty/api";
import {
  IndividualVerificationService,
  PartyIndividualServices,
} from "@/pages/partyManagment/IndividualParty/api";

//icons
import {
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";

//redux
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import { resetOrgContactMediums } from "@/redux/slices/partyManagment/organizationParty.slice";
import { resetIndContactMediums } from "@/redux/slices/partyManagment/individualParty.Slice";

//types
import {
  IContactMediumObject,
  IEmail,
  IPhoneNumber,
  IPostalAddress,
} from "@/types/model/redux/individualParty";
import { StepCopmonentProps } from "../type";
import { CONTACT_TYPES } from "@/types/enum/partyManagement";

//services
const individualService = new PartyIndividualServices();
const organizationServices = new organizationPartyServices();
const individualVerificationServices = new IndividualVerificationService();
const organizationVerificationServices = new OrganizationVerificationService();

const ContactMedium = (props: StepCopmonentProps) => {
  const { onNext, onCompletedStep, stepNumber, onPrev, isOrganization } = props;
  
  const { t } = useTranslation();
  const {
    contactMedium: contacts,
    id,
    ...rest
  } = useAppSelector(
    isOrganization
      ? (state) => state.organizationParty
      : (state) => state.individualParty
  );
  const { lang } = useAppSelector((state) => state.lang);

  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [verifyCode, setVerifyCode] = useState<string>("");
  const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [contactValues, setContactValues] = useState<any>({});
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [prefixValue, setPrefixValue] = useState<string | null>(null);

  const party = useAppSelector(
    isOrganization
      ? (state) => state.organizationParty
      : (state) => state.individualParty
  );

  const [contactType, setContactType] = useState<string>("");
  const [editContact, setEditContact] = useState<
    IEmail | IPhoneNumber | IPostalAddress
  >();

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ id, value }: { id: string; value: any }) => {
      if (isOrganization) {
        return organizationServices.updatePatch(
          { contactMedium: value, ...rest },
          id
        );
      } else {
        return individualService.updatePatch(
          { contactMedium: value, ...rest },
          id
        );
      }
    },
    onSuccess: () => {
      onCompletedStep?.(stepNumber);
      onNext();
    },
  });

  const handleOpenAdd = () => {
    setOpenAdd((prev) => !prev);
    setIsEdit(false);
  };

  const handleOnCloseDrawer = () => {
    setOpenAdd((prev) => !prev);
    setEditContact(undefined);
  };

  const handleOpenEdit = (id: string) => {
    setIsEdit(true);
    const contact = contacts?.find((item) => item.id === id);
    setEditContact(contact);
    if (contact) {
      setOpenAdd(true);
    }
  };

  // put contact from here
  const handleSaveContacts = () => {
    if (contacts && id) {
      mutate({ id, value: removeKeyFromObjectArray(contacts, "id") });
    }
    onNext();
  };

  const verifyCodeMutate = useMutation({
    mutationFn: ({
      contact,
      code,
    }: {
      contact: IContactMediumObject;
      code: string;
    }) => {
      // let contactMedium = contact;
      if (isOrganization && party.id) {
        return organizationVerificationServices.updatePatch(
          {
            code: code,
            contactMedium: contact,
          },
          party.id,
          {
            action: "verification",
          }
        );
      } else {
        return individualVerificationServices.updatePatch(
          {
            code: code,
            contactMedium: contact,
          },
          party.id || "",
          {
            action: "verification",
          }
        );
      }
    },

    onSuccess: (res: any) => {
      const contacts = res.data.contactMedium;
      const contactMediumData = contacts?.map((item: any) => {
        if (item.mediumType == "email") {
          return {
            id: uuidv4(),
            mediumType: item.mediumType,
            preferred: item.preferred,
            characteristic: {
              emailAddress: item.characteristic.emailAddress,
            },
            status: item.status,
          };
        } else {
          return {
            id: uuidv4(),
            mediumType: item.mediumType,
            preferred: item.preferred,
            characteristic: {
              phoneNumber: item.characteristic.phoneNumber,
            },
            status: item.status,
          };
        }
      });

      dispatch(
        isOrganization
          ? resetOrgContactMediums(contactMediumData)
          : resetIndContactMediums(contactMediumData)
      );

      setTableData(contactMediumData);
      messageApi.open({
        type: "success",
        content: t(messages.contactMediumSuccessfullyVerified),
      });

      setHasError(false);
      setOpenModal(false);
      setOpenSuccessModal(true);
    },
    onError: (res: any) => {
      messageApi.open({
        type: "error",
        content: res.response.data.error,
      });
      setHasError(true);
    },
  });

  const handleCheckCode = async (finalCode: string) => {
    verifyCodeMutate.mutate({
      contact: contactValues,
      code: finalCode,
    });
  };

  const handleVerificationModal = (item: any) => {
    const finalValues: {
      contactMedium: IEmail | IPhoneNumber | IPostalAddress;
    } = { contactMedium: {} };

    switch (item.mediumType) {
      case CONTACT_TYPES.EMAIL_ADDRESS:
        finalValues.contactMedium = {
          preferred: true,
          mediumType: "email",
          characteristic: {
            emailAddress: item.characteristic[0],
          },
          validFor: {
            startDateTime: "",
            endDateTime: "",
          },
        };
        break;
      case CONTACT_TYPES.PHONE_NUMBER:
        finalValues.contactMedium = {
          preferred: true,
          mediumType: CONTACT_TYPES.PHONE_NUMBER,
          characteristic: {
            phoneNumber: item.characteristic[0],
          },
          validFor: {
            startDateTime: "",
            endDateTime: "",
          },
        };
        break;
    }

    setContactValues(finalValues.contactMedium);

    setContactType(item.mediumType);
    if (item.mediumType != CONTACT_TYPES.POSTAL_ADDRESS) {
      setOpenModal(true);
      return false;
    }
  };

  const columns: ColumnsType<any> = [
    {
      dataIndex: "mediumType",
      title: t(messages.mediumType),
      key: "mediumType",
      render: (contactType) => {
        return (
          <span>
            {contactType == "email"
              ? t(messages.EMAIL_ADDRESS)
              : contactType == "phoneNumber"
              ? t(messages.phoneNumber)
              : t(messages.postalCode)}
          </span>
        );
      },
    },
    {
      dataIndex: "characteristic",
      title: t(messages.characteristic),
      key: "characteristic",
      render: (value) => <span>{value[0]}</span>,
    },
    {
      dataIndex: "status",
      title: t(messages.status),
      key: "status",
      render: (_, record) => {
        if (record.mediumType != "postalAddress") {
          return (
            <Tag
              color={record.status == "CONFIRMED" ? "green" : "geekblue"}
              key={record.status}
            >
              {record.status == "CONFIRMED"
                ? t(messages.confirmed)
                : t(messages.pending)}
            </Tag>
          );
        } else {
        }
      },
    },
    {
      title: t(messages.verify),
      dataIndex: "",
      key: "verify",
      render: (_, record) => {
        if (record.mediumType != "postalAddress") {
          return (
            <Space size="middle" className="flex justify-left gap-x-5">
              <span className="cursor-pointer">
                <Button
                  onClick={() => handleVerificationModal(record)}
                  disabled={record.status == "CONFIRMED" ? true : false}
                  className={`bg-primary text-white ${
                    record.status == "CONFIRMED" ? "disabled:opacity-25" : ""
                  }`}
                >
                  {record.status == "CONFIRMED"
                    ? t(messages.verified)
                    : t(messages.verify)}
                </Button>
              </span>
            </Space>
          );
        } else {
        }
      },
    },
    {
      title: t(messages.action),
      dataIndex: "",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle" className="flex justify-left gap-x-5">
            <span
              onClick={() => handleOpenEdit(record.id)}
              className="cursor-pointer"
            >
              <EditOutlined />
            </span>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    const contactMediumData = contacts?.map((item) => {
      return {
        id: item.id,
        mediumType: item.mediumType,
        preferred: item.preferred,
        characteristic: Object.values(item.characteristic || {}),
        status: item.status,
      };
    });

    setTableData(contactMediumData);
  }, [contacts]);

  return (
    <>
      {contextHolder}
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
          width={580}
          closable={false}
          onClose={handleOnCloseDrawer}
          open={openAdd}
          destroyOnClose
        >
          <ContactMediumForm
            onClose={handleOpenAdd}
            editContact={editContact}
            isOrganization={isOrganization}
            isEdit={isEdit}
            prefixValue={prefixValue}
            setPrefixValue={setPrefixValue}
          />
        </Drawer>

        <StyledTable columns={columns} dataSource={tableData} />
        <div className="flex mt-8">
          <Button
            className={`mr-1 flex items-center  ${lang ? "ml-1" : ""}`}
            onClick={onPrev}
          >
            {!lang ? <LeftOutlined /> : <RightOutlined />}

            {t(messages.back)}
          </Button>
          <Button
            className=" flex items-center mr-1 "
            onClick={handleSaveContacts}
            loading={isLoading}
          >
            {t(messages.next)}
            {lang ? <LeftOutlined /> : <RightOutlined />}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ContactMedium;
