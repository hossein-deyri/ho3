import { CloseOutlined, LeftOutlined, SearchOutlined, SmileOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { PARTY_TYPE } from "@/types/enum/partyManagement";
import { Select, Button, notification } from "antd";
import { useState, useEffect, useRef } from "react";
import CustomSearch from "@/components/pure-elements/customSearch";
import {
  IndividualPartyConstantsService,
  PartyIndividualServices,
} from "../../IndividualParty/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IOrganizationPartyRes } from "@/types/model/entity/organizationParty.model";
import { IindividualPartyRes } from "@/pages/partyManagment/IndividualParty/type";
import { IndividualRelatedParty } from "@/types/model/redux/individualParty";
import { addRelatedOrganizationParty } from "@/redux/slices/partyManagment/organizationParty.slice";
import { IOrganizationRelatedParty } from "@/types/model/redux/organizationParty";
import { useQuery } from "@tanstack/react-query";
import { organizationPartyServices } from "@/pages/partyManagment/organizationParty/api";
import { addRelatedIndividualParty } from "@/redux/slices/partyManagment/individualParty.Slice";
import messages from "./messages";
import { addRelatedParty } from "@/redux/slices/productManagement/catalog.slice";
import { addSpecificationRelatedParty } from "@/redux/slices/productManagement/specification.slice";
import { addInventoryRelatedParty } from "@/redux/slices/productManagement/productInventory.slice";


interface Iprops {
  onClose: () => void;
  isOrganization?: boolean;
  isProduct?: boolean;
  isSpecification?: boolean;
  isInventory?: boolean;
}

const constantServices = new IndividualPartyConstantsService();

const RelatedPartyForm = (props: Iprops) => {
  const { onClose, isOrganization, isProduct, isSpecification, isInventory } = props;

  const { Option } = Select;
  const [partyType, setPartyType] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [findParty, setFindParty] = useState({});
  const [partyTypeError, setPartyTypeError] = useState<boolean>(false);
  const [forceUpdate, setforceUpdate] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const dispatch = useAppDispatch();

  const [api, contextHolder] = notification.useNotification();
  const { lang } = useAppSelector((state) => state.lang);

  if (partyType === PARTY_TYPE.INDIVIDUAL) {
    const { individualIdentification, contactMedium, id, ...rest } =
      useAppSelector((state) => state.individualParty);
  } else {
    const { organizationIdentification, contactMedium, id, ...rest } =
      useAppSelector((state) => state.organizationParty);
  }

  let services =
    partyType === PARTY_TYPE.INDIVIDUAL
      ? new PartyIndividualServices()
      : new organizationPartyServices();

  const handlePartyType = (type: string): void => {
    setPartyType(type);
  };

  const handlePartyRole = (role: string): void => {
    setRole(role);
  };

  const individualLatinTypes = [
    {
      value: PARTY_TYPE.INDIVIDUAL,
      label: PARTY_TYPE.INDIVIDUAL,
    },
    {
      value: PARTY_TYPE.ORGANIZATION,
      label: PARTY_TYPE.ORGANIZATION,
    },
  ];

  const individualPersianTypes = [
    {
      value: PARTY_TYPE.INDIVIDUAL,
      label: "اشخاص حقیقی",
    },
    {
      value: PARTY_TYPE.ORGANIZATION,
      label: "اشخاص  حقوقی",
    },
  ];

  useEffect(() => {
    if (partyType) setPartyTypeError(false);
  }, [partyType]);

  const handleReturnSearchValue = (
    item: IOrganizationPartyRes | IindividualPartyRes
  ): IndividualRelatedParty | IOrganizationRelatedParty => {
    return {
      name:
        "tradingName" in item
          ? item.tradingName
          : "givenName" in item
          ? item.givenName + " " + item.familyName
          : "",
      role: role,
      href: item.href,
      id: item.id,
      "@referredType": item["@baseType"] ?? "Organization",
    };
  };

  const handleSelect = async ({
    value,
    queryKey,
  }: {
    value: string;
    queryKey: string;
  }) => {
    const payload: any = {};
    payload[queryKey] = value.trim();
    const { data } = await services.getList(payload);
    setSearchValue(value);
    setFindParty(data[0]);
  };

  const searchByIdentificationId = async (value: string) => {
    const data = await services.getList({ identificationId: value });

    if (partyType === PARTY_TYPE.INDIVIDUAL) {
      return data.data.map((item: any) => {
        return {
          id: item.id,
          key: item.id,
          label: `${
            item?.individualIdentification?.find((item: any) =>
              item.identificationId?.includes(value)
            )?.identificationId
          }`,
          value: `${
            item.individualIdentification?.find((item: any) =>
              item.identificationId?.includes(value)
            )?.identificationId
          }`,
        };
      });
    } else {
      return data.data.map((item: any) => {
        return {
          id: item.id,
          key: item.id,
          label: `${
            item?.organizationIdentification?.find((item: any) =>
              item.identificationId?.includes(value)
            )?.identificationId
          }`,
          value: `${
            item.organizationIdentification?.find((item: any) =>
              item.identificationId?.includes(value)
            )?.identificationId
          }`,
        };
      });
    }
  };

  const handleRemove = (id: string) => {
    // dispatch(removeRelatedIndividualParty(id));
  };

  const saveRelatedParty = () => {
    if (!partyType) {
      setPartyTypeError(true);
      return false;
    } else {
      setPartyTypeError(false);
      if (isOrganization) {
        dispatch(
          addRelatedOrganizationParty(handleReturnSearchValue(findParty))
        );
      } else if (isProduct) {
        dispatch(addRelatedParty(handleReturnSearchValue(findParty)));
      }
      else if (isInventory) {
        dispatch(addInventoryRelatedParty(handleReturnSearchValue(findParty)));
      } else if (isSpecification) {
        dispatch(addSpecificationRelatedParty(handleReturnSearchValue(findParty)));
      } else {
        dispatch(addRelatedIndividualParty(handleReturnSearchValue(findParty)));
      }
      setforceUpdate(true);
      onClose();
      setRole("");
      setPartyType("");
    }
  };

  const rolesList = useQuery({
    queryKey: ["roleTypes"],
    queryFn: async () => {
      const data = await constantServices.getList({
        type: "ROLE_TYPE",
        language: "fa",
      });
      return data.data;
    },
  });

  return (
    <>
      <CloseOutlined className="mb-10" onClick={onClose} />
      <div className="flex flex-col">
        <div className="party-type flex flex-col mb-5">
          <label className="mb-1">
            <span className="mr-2" style={{ color: "red" }}>
               *
            </span>
            {t(messages.partyTypes)}
          </label>
          <Select
            status={partyTypeError ? `error` : ""}
            value={partyType}
            style={{ width: "50%" }}
            placeholder={t(messages.pleaseSelectTheType)}
            onChange={(type) => handlePartyType(type)}
            options={lang ? individualPersianTypes : individualLatinTypes}
          />
     
          <span
            className={`mt-1 ${!partyTypeError ? "hidden" : ""}`}
            style={{ color: "red" }}
          >
            {t(messages.pleaseChoosePartyType)}
          </span>
        </div>
        <div className="mb-5 mt-5">
          <label className="mb-2">
            {t(messages.searchByIdentificationId)}
          </label>
          <CustomSearch
            ItemDisabled={!partyType}
            fetchFunc={searchByIdentificationId}
            queryKey={
              partyType === PARTY_TYPE.ORGANIZATION
                ? "organizationIdentificationId"
                : "identificationId"
            }
            label={t(messages.search)}
            selectFunc={handleSelect}
            onRemove={handleRemove}
          />
        </div>
        <div className="party-role flex flex-col mt-5 mb-5">
          <label className="mb-1"> {t(messages.role)}</label>
          <Select
            value={role}
            style={{ width: "50%" }}
            placeholder={t(messages.pleaseSelectTheRole)}
            onChange={(role) => handlePartyRole(role)}
          >
            {rolesList?.data?.map((item, index) => (
              <Option value={item.name} key={index}>
                {t(item.title)}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <Button
        type="primary"
        className="flex items-center bg-primary text-white"
        onClick={saveRelatedParty}
        disabled={!searchValue}
      >
        {t(messages.done)}
      </Button>
    </>
  );
};

export default RelatedPartyForm;
