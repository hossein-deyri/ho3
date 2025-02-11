import { Drawer, Spin, Steps, message } from "antd";
import { useTranslation } from "react-i18next";
import React, { Suspense, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import messages from "../messages";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import { ApiResponse } from "@/types/model/service/api-response.model";
import { IindividualPartyRes } from "../type";

const PartyInformation = React.lazy(() => import("./PartyInformation"));
const ContactMedium = React.lazy(
  () => import("../../create/contactMedium/ContactMedium")
);
const Identification = React.lazy(
  () => import("../../create/identification/Identification")
);
const RelatedParty = React.lazy(
  () => import("../../create/relatedParty/RelatedParty")
);
const PartyCharacteristic = React.lazy(
  () => import("../../create/characteristic/partyCharacteristic")
);

interface Iprops {
  openDrawer: boolean;
  onClose: () => void;
  isEdit?: boolean;
  individualRefetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<
    QueryObserverResult<ApiResponse<IindividualPartyRes[]>, unknown>
  >;
}

const CreateIndividualParty = (props: Iprops) => {
  const { onClose, openDrawer, isEdit, individualRefetch } = props;
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { lang } = useAppSelector((state) => state.lang);

  const [current, setCurrent] = useState<number>(0);
  const [completedStep, setCompletedStep] = useState<number[]>([]);

  const handleCompletedStep = (stepNumber: number) => {
    setCompletedStep((perv) => [...perv, stepNumber]);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const next = () => {
    setCurrent(current + 1);
  };

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
        <PartyInformation
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
          
        />
      ),
    },
    {
      title: t(messages.identification),
      content: (
        <Identification
          onNext={next}
          onClose={onClose}
          onPrev={prev}
          onCompletedStep={handleCompletedStep}
          stepNumber={2}
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
          individualRefetch={individualRefetch}
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
        open={openDrawer}
        width={"85%"}
        onClose={onClose}
        destroyOnClose
        placement={lang ? "right" : "left"}
      >
        <div className="flex gap-x-10">
          <div className="w-1/5">
            <Steps
              direction="vertical"
              size="small"
              current={current}
              items={items}
              onChange={onChange}
            />
          </div>
          <div className="w-full h-full flex justify-center items-center">
            <Suspense fallback={<Spin size="large" />}>
              {steps[current]?.content}
            </Suspense>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default CreateIndividualParty;
