import { Button, Modal, Divider, Input, Empty, Drawer } from "antd";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { SearchOutlined, RightOutlined, LeftOutlined } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useEffect, useState } from "react";
import RelatedPartyForm from "./RelatedPartyForm";
import { StepCopmonentProps } from "../type";
import { PartyIndividualServices } from "../../IndividualParty/api";
import { organizationPartyServices } from "@/pages/partyManagment/organizationParty/api";
import { IndividualRelatedParty } from "@/types/model/redux/individualParty";
import RelatedPartyCard from "./RelatedPartyCard";
import { removeRelatedIndividualParty } from "@/redux/slices/partyManagment/individualParty.Slice";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
} from "@tanstack/react-query";
import { removeKeyFromObjectArray } from "@/tools/pure-function/deleteFormDeepCopy";
import { CustomModal } from "@/assets/style/styledModal/style";
import { IOrganizationRelatedParty } from "@/types/model/redux/organizationParty";
import { removeRelatedOrganizationParty } from "@/redux/slices/partyManagment/organizationParty.slice";
import messages from "./messages";
import { CatalogueServices } from "@/pages/productManagment/catalogue/api";
import { SpecificationServices } from "@/pages/productManagment/specification/api";
import { removeRelatedParty } from "@/redux/slices/productManagement/catalog.slice";
import { removeSpecificationRelatedParty } from "@/redux/slices/productManagement/specification.slice";
import { ApiResponse } from "@/types/model/service/api-response.model";
import { IindividualPartyRes } from "../../IndividualParty/type";
import { IOrganizationPartyRes } from "@/types/model/entity/organizationParty.model";
import { InventoryServices } from "@/pages/productManagment/inventory/api";
import { removeInventoryRelatedParty } from "@/redux/slices/productManagement/productInventory.slice";

const individualServices = new PartyIndividualServices();
const organizationServices = new organizationPartyServices();
const catalogServices = new CatalogueServices();
const specificationServices = new SpecificationServices();
const inventoryServices = new InventoryServices();

interface Props extends StepCopmonentProps {
  isProduct?: boolean;
  isInventory?: boolean;
  isSpecification?: boolean;
  individualRefetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<
    QueryObserverResult<ApiResponse<IindividualPartyRes[]>, unknown>
  >;
  organizationRefetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<
    QueryObserverResult<ApiResponse<IOrganizationPartyRes[]>, unknown>
  >;
}

const RelatedParty = (props: Props) => {
  const { t } = useTranslation();
  const { lang } = useAppSelector((state) => state.lang);
  const {
    onNext,
    onPrev,
    onClose,
    isOrganization,
    isProduct,
    isSpecification,
    isInventory,
    individualRefetch,
    organizationRefetch,
    onCompletedStep,
    stepNumber,
  } = props;
  const [filteredRelatedParty, setFilteredRelatedParty] = useState<
    IndividualRelatedParty[] | IOrganizationRelatedParty[] | undefined
  >();

  const {
    organizationIdentification,
    contactMedium: organizationContacts,
    id: organizationId,
    relatedParty: organizationRelatedParty,
    ...organizationRest
  } = useAppSelector((state) => state.organizationParty);

  const {
    individualIdentification,
    contactMedium: individualContacts,
    id: individualId,
    relatedParty: individualRelatedParty,
    ...individualRest
  } = useAppSelector((state) => state.individualParty);

  const individualParty = useAppSelector((state) => state.individualParty);
  const catalog = useAppSelector((state) => state.catalog);
  const specification = useAppSelector((state) => state.specification);
  const inventory = useAppSelector((state) => state.productInventory);

  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [searchId, setSearchId] = useState<string | undefined>("");
  const dispatch = useAppDispatch();
  const [modal, contextHolder] = CustomModal.useModal();

  useEffect(() => {
    setFilteredRelatedParty(
      isProduct
        ? catalog.relatedParty
        : isSpecification
        ? specification.relatedParty
        : isInventory
        ? inventory.relatedParty
        : isOrganization
        ? organizationRelatedParty
        : individualRelatedParty
    );
  }, [
    organizationRelatedParty,
    individualRelatedParty,
    catalog.relatedParty,
    specification.relatedParty,
    inventory.relatedParty,
  ]);

  const handleOnCloseDrawer = () => {
    setOpenAdd((prev) => !prev);
  };

  const handleCloseAdd = () => {
    setOpenAdd((prev) => !prev);
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleSearch = async (e: any) => {
    setSearchId(e.target.value);
    // Get Individual Parties Ids
    const individualData = await individualServices.getList({
      identificationId: e.target.value,
    });

    const individualPartyIds: String[] = [];
    individualData.data.map((individualParty) => {
      individualPartyIds.push(individualParty.id);
    });

    // Get organization Parties Ids
    const organizationData = await organizationServices.getList({
      organizationIdentificationId: e.target.value,
    });

    const organizationPartyIds: String[] = [];
    organizationData.data.map((organizationParty) => {
      organizationParty.id && organizationPartyIds.push(organizationParty.id);
    });

    const partyIds = organizationPartyIds.concat(individualPartyIds);

    if (isOrganization) {
      const matchesParties = organizationRelatedParty?.filter(function (
        item: any
      ) {
        return partyIds.includes(item.id || "");
      });
      setFilteredRelatedParty(matchesParties);
    } else if (isSpecification) {
      const matchesParties = specification.relatedParty?.filter(function (
        item: any
      ) {
        return partyIds.includes(item.id || "");
      });
      setFilteredRelatedParty(matchesParties);
    } else if (isProduct) {
      const matchesParties = catalog.relatedParty?.filter(function (item: any) {
        return partyIds.includes(item.id || "");
      });
      setFilteredRelatedParty(matchesParties);
    } else if (isInventory) {
      const matchesParties = inventory.relatedParty?.filter(function (
        item: any
      ) {
        return partyIds.includes(item.id || "");
      });
      setFilteredRelatedParty(matchesParties);
    } else {
      const matchesParties = individualRelatedParty?.filter(function (
        item: any
      ) {
        return partyIds.includes(item.id || "");
      });
      setFilteredRelatedParty(matchesParties);
    }
  };

  const handleRemove = (id: string) => {
    const deleteAction = isProduct
      ? removeRelatedParty
      : isOrganization
      ? removeRelatedOrganizationParty
      : isSpecification
      ? removeSpecificationRelatedParty
      : isInventory
      ? removeInventoryRelatedParty
      : removeRelatedIndividualParty;
    dispatch(deleteAction(id));
  };

  const mutateOrganization = useMutation({
    mutationFn: ({ id, value }: { id: string; value: any }) => {
      return organizationServices.updatePut(
        {
          contactMedium: value.contactMedium,
          organizationIdentification: value.organizationIdentification,
          relatedParty: value.organizationRelatedParty,
          ...organizationRest,
        },
        id
      );
    },
    onSuccess: () => {
      onCompletedStep?.(stepNumber);
      // onNext();
    },
  });

  const mutateIndividual = useMutation({
    mutationFn: ({ id, value }: { id: string; value: any }) => {
      return individualServices.updatePut(
        {
          contactMedium: value.contactMedium,
          individualIdentification: value.individualIdentification,
          relatedParty: value.individualRelatedParty,
          ...individualRest,
        },
        id
      );
    },
    onSuccess: () => {
      // onCompletedStep?.(stepNumber);
      // onNext();
    },
  });

  const mutatecatalog = useMutation({
    mutationFn: ({ id, value }: { id: string; value: any }) => {
      return catalogServices.updatePut({ ...catalog }, catalog.id || "");
    },
    onSuccess: () => {
      // onClose?.();
    },
  });

  const mutateSpecification = useMutation({
    mutationFn: ({ id, value }: { id: string; value: any }) => {
      return specificationServices.updatePut(
        { ...specification },
        specification.id || ""
      );
    },
    onSuccess: () => {
      // onClose?.();
    },
  });

  const mutateInventory = useMutation({
    mutationFn: ({ id, value }: { id: string; value: any }) => {
      return inventoryServices.updatePut({ ...inventory }, inventory.id || "");
    },
    onSuccess: () => {
      onClose?.();
    },
  });

  const handleSubmitRelatedParty = () => {
    if (isOrganization) {
      if (organizationId) {
        mutateOrganization.mutate({
          id: organizationId,
          value: {
            contactMedium: removeKeyFromObjectArray(
              organizationContacts || [],
              "id"
            ),
            organizationIdentification: removeKeyFromObjectArray(
              organizationIdentification || [],
              "id"
            ),
            organizationRelatedParty,
          },
        });
      }
    } else if (isProduct) {
      mutatecatalog.mutate({ id: catalog.id || "", value: {} });
    } else if (isSpecification) {
      mutateSpecification.mutate({ id: specification.id || "", value: {} });
    } else if (isInventory) {
      mutateInventory.mutate({ id: inventory.id || "", value: {} });
    } else {
      if (individualId) {
        mutateIndividual.mutate({
          id: individualId,
          value: {
            contactMedium: removeKeyFromObjectArray(
              individualContacts || [],
              "id"
            ),
            individualIdentification: removeKeyFromObjectArray(
              individualIdentification || [],
              "id"
            ),
            individualRelatedParty,
          },
        });
      }
    }
    onClose?.();
    individualRefetch ? individualRefetch() : null;
    organizationRefetch ? organizationRefetch() : null;
  };

  const handleReviewRelatedParty = () => {
    const errorMessages = [];
    if (!isProduct && !isSpecification && !isInventory) {
      if (isOrganization) {
        if (
          !individualContacts?.find(
            (item) => item.mediumType === "postalAddress"
          )
        ) {
          errorMessages.push(
            t(messages.PleaseFillYourPostalAddressInContactMedium)
          );
        }
        if (organizationRelatedParty?.length === 0) {
          errorMessages.push(t(messages.PleaseFillYourRelatedParty));
        }
      } else {
        if (!individualParty.title) {
          errorMessages.push(
            t(messages.PleaseFillYourGenderInPartyInformation)
          );
        }
        if (!individualParty.birthDate) {
          errorMessages.push(
            t(messages.PleaseFillYourBirthDateInPartyInformation)
          );
        }
        if (!individualParty.aristocraticTitle) {
          errorMessages.push(
            t(messages.PleaseFillYourFatherNameInPartyInformation)
          );
        }
        if (
          !individualContacts?.find(
            (item) => item.mediumType === "postalAddress"
          )
        ) {
          errorMessages.push(
            t(messages.PleaseFillYourPostalAddressInContactMedium)
          );
        }
      }
      if (errorMessages.length === 0) {
        Modal.success({
          content: t(messages.TheFormHasBeenCompletedSuccessfully),
        });
        handleSubmitRelatedParty();
      } else {
        modal.confirm({
          title: t(
            messages.CompleteTheFollowingFieldsThenSelectTheFinishOption
          ),
          icon: <ExclamationCircleOutlined />,
          content: (
            <div>
              {errorMessages.map((message, index) => (
                <p key={index}>{message}</p>
              ))}
            </div>
          ),
          okText: (
            <div onClick={handleSubmitRelatedParty}>
              {t(messages.AgreeAndContinue)}
            </div>
          ),
          cancelText: t(messages.FillInTheInformation),
        });
      }
    } else {
      handleSubmitRelatedParty();
    }
  };

  return (
    <section className="w-full items-stretch gap-10 ">
      <div className="flex gap-20 pe-5  w-[800px] ">
        <Button
          type="primary"
          className="flex items-center bg-primary"
          onClick={handleOpenAdd}
        >
          <PlusOutlined />
          {t(messages.add)}
        </Button>
        <div className="flex flex-col" style={{ width: "100%" }}>
          <Input
            width={1000}
            placeholder={t(messages.searchByIdentificationId)}
            prefix={<SearchOutlined />}
            onChange={handleSearch}
            value={searchId}
          />
        </div>
      </div>

      <div className=" w-full h-full grid grid-cols-3 gap-3 mt-5">
        {filteredRelatedParty &&
          filteredRelatedParty?.length > 0 &&
          filteredRelatedParty.map((party, index) => (
            <RelatedPartyCard key={index} onRemove={handleRemove} {...party} />
          ))}
      </div>

      <div className=" mt-5">
        {!filteredRelatedParty ||
          (!filteredRelatedParty.length && (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ))}
      </div>

      <Divider />
      <div className="flex mt-8">
        <Button
          className={` mr-1 flex items-center ${lang ? "ml-1" : ""}`}
          onClick={onPrev}
        >
          {!lang ? <LeftOutlined /> : <RightOutlined />}

          {t(messages.back)}
        </Button>
        <Button
          className="flex items-center mr-1 "
          onClick={handleReviewRelatedParty}
        >
          {t(messages.finish)}
          {lang ? <LeftOutlined /> : <RightOutlined />}
        </Button>
      </div>
      {contextHolder}
      <Drawer
        onClose={handleOnCloseDrawer}
        width={500}
        closable={false}
        open={openAdd}
        destroyOnClose
      >
        <RelatedPartyForm
          isProduct={isProduct}
          isInventory={isInventory}
          isSpecification={isSpecification}
          isOrganization={isOrganization}
          onClose={handleCloseAdd}
        />
      </Drawer>
    </section>
  );
};

export default RelatedParty;
