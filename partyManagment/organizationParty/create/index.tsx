import { Col, Drawer, Row, Spin, Steps, message } from "antd";
import React, { Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import MainInfo from "./MainInfo";
import RelatedParty from "../../create/relatedParty/RelatedParty";
import ContactMedium from "../../create/contactMedium/ContactMedium";
import Identification from "../../create/identification/Identification";
import { useAppSelector } from "@/redux/hooks";
import messages from "../messages";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import { ApiResponse } from "@/types/model/service/api-response.model";
import { IOrganizationPartyRes } from "@/types/model/entity/organizationParty.model";

//component
const PartyCharacteristic = React.lazy(
  () => import("../../create/characteristic/partyCharacteristic")
);

interface Props {
  onClose: () => void;
  openDrawer: boolean;
  isEdit: boolean;
  organizationRefetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<
    QueryObserverResult<ApiResponse<IOrganizationPartyRes[]>, unknown>
  >;
}

const CreateOrganizationParty: React.FC<Props> = ({
  onClose,
  openDrawer,
  isEdit,
  organizationRefetch,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { lang } = useAppSelector((state) => state.lang);

  const [current, setCurrent] = useState(0);
  const [completedStep, setCompletedStep] = useState<number[]>([]);
  const { t } = useTranslation();

  const handleCompletedStep = (stepNumber: number) => {
    setCompletedStep((perv) => [...perv, stepNumber]);
  };

  const next = () => {
    setCurrent(current + 1);
  };
  
  const prev = () => {
    setCurrent(current - 1);
  };

  // const done = () => {
  //   message.success("Processing complete!");
  //   onClose();
  // };

  const onChange = (value: number) => {
    const isStepCompleted = completedStep.find((step) => step === value);
    if (isStepCompleted === 0 || isStepCompleted || isEdit) {
      setCurrent(value);
    } else {
      messageApi.open({
        type: "error",
        content: t(messages.stepValidation),
      });
    }
  };

  const steps = [
    {
      title: t(messages.partyInformation),
      content: (
        <MainInfo
          onNext={next}
          onCompletedStep={handleCompletedStep}
          stepNumber={0}
        />
      ),
    },
    {
      title: t(messages.contactMedium),
      content: (
        <ContactMedium
          onNext={next}
          onPrev={prev}
          onCompletedStep={handleCompletedStep}
          stepNumber={1}
          isOrganization={true}
          
        />
      ),
    },
    {
      title: t(messages.identification),
      content: (
        <Identification
          onNext={next}
          onPrev={prev}
          onClose={onClose}
          onCompletedStep={handleCompletedStep}
          stepNumber={2}
          isOrganization={true}
        />
      ),
    },

    {
      title: t(messages.characteristic),
      content: (
        <PartyCharacteristic
          onNext={next}
          onPrev={prev}
          onCompletedStep={handleCompletedStep}
          stepNumber={3}
          isOrganization={true}
        />
      ),
    },
    {
      title: t(messages.relatedParty),
      content: (
        <RelatedParty
          onNext={next}
          onPrev={prev}
          onCompletedStep={handleCompletedStep}
          stepNumber={4}
          onClose={onClose}
          isOrganization={true}
          organizationRefetch={organizationRefetch}
        />
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <>
      {contextHolder}
      <Drawer
        onClose={onClose}
        open={openDrawer}
        width={"85%"}
        destroyOnClose
        placement={lang ? "right" : "left"}
      >
        <Row>
          <Col span={20} push={4}>
            <Suspense fallback={<Spin size="large" />}>
              <div>{steps[current]?.content}</div>
            </Suspense>
          </Col>
          <Col span={4} pull={20}>
            <Steps
              current={current}
              items={items}
              direction="vertical"
              onChange={onChange}
              size="small"
            />
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default CreateOrganizationParty;
