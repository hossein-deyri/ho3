import CustomSearch from "@/components/pure-elements/customSearch";
import PartyCard from "@/components/pure-elements/partyCard";
import { IndividualRelatedParty } from "@/types/model/redux/individualParty";
import { Button, notification } from "antd";
import { PartyIndividualServices } from "../../IndividualParty/api";
import { IindividualPartyRes } from "../../IndividualParty/type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addRelatedIndividualParty,
  removeRelatedIndividualParty,
} from "@/redux/slices/partyManagment/individualParty.Slice";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { LeftOutlined, RightOutlined, SmileOutlined } from "@ant-design/icons";
import { StepCopmonentProps } from "../type";
import messages from "./messages";

const services = new PartyIndividualServices();

const SelectRelatedParty = (props: StepCopmonentProps) => {
  const { onClose, onCompletedStep, stepNumber, onPrev, onNext } = props;

  const dispatch = useAppDispatch();
  const { relatedParty } = useAppSelector((state) => state.individualParty);
  const { t } = useTranslation();
  const { lang } = useAppSelector(state => state.lang);

  const { individualIdentification, contactMedium, id, ...rest } =
    useAppSelector((state) => state.individualParty);

  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: t(messages.IndividualPartyCreated),
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };

  // update individual party with related party

  // const { mutate, isLoading } = useMutation({
  //   mutationFn: ({ id, value }: { id: string; value: any }) => {
  //     return services.updatePut(
  //       // {
  //       //   contactMedium: value.contactMedium,
  //       //   individualIdentification: value.individualIdentification,
  //       //   ...rest,
  //       // },
  //       // id
  //     );
  //   },
  //   onSuccess: () => {
  //     openNotification();
  //     onClose?.();
  //   },
  // });

  const handleSaveRelatedParty = () => {
    if (id) {
      const deepCopyContacts: any[] =
        contactMedium &&
        contactMedium.length > 0 &&
        JSON.parse(JSON.stringify(contactMedium));
      const finalContactMedium = deepCopyContacts?.map((item) => {
        delete item.id;
        return item;
      });
      const deepCopyIdentification: any[] =
        individualIdentification &&
        individualIdentification.length > 0 &&
        JSON.parse(JSON.stringify(individualIdentification));
      const finalIdentification = deepCopyIdentification?.map((item) => {
        delete item.id;
        return item;
      });
      // mutate({
      //   id,
      //   value: {
      //     contactMedium: finalContactMedium,
      //     individualIdentification: finalIdentification,
      //   },
      // });
    }
    onNext();
  };

  // update individual party with related party

  const handleReturnSearchValue = (
    item: IindividualPartyRes
  ): IndividualRelatedParty => {
    return {
      name: `${item.givenName} ${item.familyName}`,
      role: "",
      href: item.href,
      "@referredType": item["@baseType"],
      id: item.id,
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
    dispatch(addRelatedIndividualParty(handleReturnSearchValue(data[0])));
  };

  const handleRemove = (id: string) => {
    dispatch(removeRelatedIndividualParty(id));
  };

  const searchByGivenName = (value: string) => {
    return services.getList
      .bind(services)({ givenName: value })
      .then((body) =>
        body.data.map((item) => ({
          label: `${item.givenName} ${item.familyName}`,
          value: `${item.givenName}`,
          id: item.id,
          key: item.id,
        }))
      );
  };

  const searchByFamily = (value: string) => {
    return services.getList
      .bind(services)({ familyName: value })
      .then((body) =>
        body.data.map((item) => ({
          label: `${item.familyName}`,
          value: `${item.familyName} `,
          id: item.id,
          key: item.id,
        }))
      );
  };

  const searchByIdentificationId = (value: string) => {
    return services.getList
      .bind(services)({ identificationId: value })
      .then((body) =>
        body.data.map((item) => ({
          label: `${
            item.individualIdentification?.find((item) =>
              item.identificationId?.includes(value)
            )?.identificationId
          }`,
          value: `${
            item.individualIdentification?.find((item) =>
              item.identificationId?.includes(value)
            )?.identificationId
          }`,
          id: item.id,
          key: item.id,
        }))
      );
  };

  return (
    <section className="w-full flex items-stretch gap-10 ">
      {contextHolder}
      <div className="flex flex-col gap-20 pe-5 border-r border-gray w-[400px] ">
        {/* <CustomSearch
          ItemDisabled={false}
          isMultiple
          fetchFunc={searchByGivenName}
          queryKey={"givenName"}
          label={t(messages.searchByGivenName)}
          selectFunc={handleSelect}
          onRemove={handleRemove}
        /> */}
        <CustomSearch
          ItemDisabled={false}
          isMultiple
          fetchFunc={searchByFamily}
          queryKey={"familyName"}
          label={t(messages.searchByGivenName)}
          selectFunc={handleSelect}
          onRemove={handleRemove}
        />
        <CustomSearch
          ItemDisabled={false}
          isMultiple
          fetchFunc={searchByIdentificationId}
          queryKey={"identificationId"}
          label={t(messages.searchByIdentificationId)}
          selectFunc={handleSelect}
          onRemove={handleRemove}
        />
        <div>
          <div className="flex mt-8">
            <Button
              type="primary"
              onClick={onPrev}
              className={`bg-primary text-white mr-1 flex items-center ${
                lang ? "ml-1" : ""
              }`}
            >
              {!lang ? <LeftOutlined /> : <RightOutlined />}
              {t(messages.back)}
            </Button>
            <Button
              type="primary"
              className="flex items-center mr-1 bg-primary"
              onClick={handleSaveRelatedParty}
              // loading={isLoading}
            >
              {t(messages.next)}
              {lang ? <LeftOutlined /> : <RightOutlined />}
            </Button>
          </div>
        </div>
      </div>
      <div className=" w-full h-full grid grid-cols-2 gap-3">
        {relatedParty &&
          relatedParty?.length > 0 &&
          relatedParty.map((party) => (
            <PartyCard {...party} key={party.id} onRemove={handleRemove} />
          ))}
      </div>
    </section>
  );
};

export default SelectRelatedParty;
