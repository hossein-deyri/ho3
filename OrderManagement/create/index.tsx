import React, { Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { messages } from "../messages";
import { Dispatch, SetStateAction } from "react";

//components
import { Drawer, FormInstance, Spin, Steps, message } from "antd";
import RelatedParty from "./relatedParty/relatedParty";
import ProductOrderingMainInfo from "./mainInfo";

//api
import {
  ProductOrdering,
  ProductOrderingRes,
} from "@/types/model/entity/productOrdering.model";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";

//redux
import { useAppSelector } from "@/redux/hooks";

interface Props {
  openDrawer: boolean;
  onClose: () => void;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<ProductOrderingRes[], unknown>>;
  isEdit: boolean;
  orderId: string;
  editOrderData: ProductOrdering | null;
  form: FormInstance<any>;
}

const CreateOrderManagement: React.FC<Props> = ({
  openDrawer,
  onClose,
  refetch,
  isEdit,
  orderId,
  editOrderData,
  form,
}) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { lang } = useAppSelector((state) => state.lang);

  const [current, setCurrent] = useState<number>(0);
  const [completedStep, setCompletedStep] = useState<number[]>([]);

  const prev = () => {
    setCurrent(current - 1);
  };
  const next = () => {
    setCurrent(current + 1);
  };

  const handleCompletedStep = (stepNumber: number) => {
    setCompletedStep((perv) => [...perv, stepNumber]);
  };

  // const onChange = (value: number) => {
  //   const isStepCompleted = completedStep.find((step) => step === value);
  //   if (isStepCompleted === 0 || isStepCompleted || isEdit) {
  //     setCurrent(value);
  //   } else {
  //     messageApi.open({
  //       type: "error",
  //       content: t(messages.stepValidation),
  //     });
  //   }
  // };

  const steps = [
    {
      title: t(messages.mainInfo),
      content: (
        <ProductOrderingMainInfo
          onClose={onClose}
          refetch={refetch}
          isEdit={isEdit}
          orderId={orderId}
          editOrderData={editOrderData ? editOrderData : null}
          form={form}
        />
      ),
    },
    {
      title: t(messages.relatedParty),
      content: <RelatedParty />,
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
              // onChange={onChange}
            />
          </div>
          <div className="w-full h-full flex justify-start items-center">
            <Suspense fallback={<Spin size="large" />}>
              {steps[current]?.content}
            </Suspense>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default CreateOrderManagement;
