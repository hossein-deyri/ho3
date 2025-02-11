import { Button, Col, Form, FormInstance, Row } from "antd";
import { useTranslation } from "react-i18next";
import { messages } from "../messages";
import { Dispatch, SetStateAction, useEffect } from "react";

//form
import ProductOrderingFormUnits from "./formUnits";
import FormElement from "@/components/dynamic-render/Form-Render-Component/Form/FormElement";
import FormDynamicRenderer from "@/components/dynamic-render/Form-Render-Component/Form/Form";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
} from "@tanstack/react-query";
import { ProductOrderingServices } from "../api";
import {
  ProductOrdering,
  ProductOrderingRes,
} from "@/types/model/entity/productOrdering.model";
import { CustomBorderButtom } from "@/assets/style/customBorderButtom/style";

interface Props {
  onClose: () => void;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<ProductOrderingRes[], unknown>>;
  isEdit: boolean;
  orderId: string;
  editOrderData: ProductOrdering | null;
  form: FormInstance<any>;
}

const service = new ProductOrderingServices();

const ProductOrderingMainInfo: React.FC<Props> = ({
  onClose,
  refetch,
  isEdit,
  orderId,
  editOrderData,
  form,
}) => {
  const { t } = useTranslation();

  //create data
  const createOrder = useMutation({
    mutationFn: async (value: any) => {
      const data = await service.create(value);
      return data;
    },
    onSuccess: (res) => {
      onClose();
      refetch();
    },
  });

  //edit data
  const updateOrder = useMutation({
    mutationFn: async (value: ProductOrderingRes) => {
      const data = await service.updatePut(value, orderId);
      return data;
    },
    onSuccess: (res) => {
      onClose();
      refetch();
    },
  });

  let initialValues = {
    billingAccount: "test",
    characteristicName:
      editOrderData?.productOrderItem?.[
        editOrderData?.productOrderItem.length - 1
      ]?.product?.productCharacteristic?.[0].name,
    characteristicValue:
      editOrderData?.productOrderItem?.[
        editOrderData?.productOrderItem.length - 1
      ]?.product?.productCharacteristic?.[0].value,
    productSpecification:
      editOrderData?.productOrderItem?.[
        editOrderData?.productOrderItem.length - 1
      ]?.product?.productSpecification?.name,
    productOffering:
      editOrderData?.productOrderItem?.[
        editOrderData?.productOrderItem.length - 1
      ]?.productOffering?.name,
    priceType:
      editOrderData?.productOrderItem?.[
        editOrderData?.productOrderItem.length - 1
      ].itemPrice?.[0].priceType,
    dutyUnits:
      editOrderData?.productOrderItem?.[
        editOrderData?.productOrderItem.length - 1
      ].itemPrice?.[0].price?.dutyFreeAmount?.unit,
    dutyValue:
      editOrderData?.productOrderItem?.[
        editOrderData?.productOrderItem.length - 1
      ].itemPrice?.[0].price?.dutyFreeAmount?.amount,
    taxUnits:
      editOrderData?.productOrderItem?.[
        editOrderData?.productOrderItem.length - 1
      ].itemPrice?.[0].price?.taxIncludedAmount?.unit,
    taxValue:
      editOrderData?.productOrderItem?.[
        editOrderData?.productOrderItem.length - 1
      ].itemPrice?.[0].price?.taxIncludedAmount?.amount,
    termName:
      editOrderData?.productOrderItem?.[
        editOrderData?.productOrderItem.length - 1
      ].itemTerm?.[0].name,
    durationAmount:
      editOrderData?.productOrderItem?.[
        editOrderData?.productOrderItem.length - 1
      ].itemTerm?.[0].duration?.amount,
    durationUnits:
      editOrderData?.productOrderItem?.[
        editOrderData?.productOrderItem.length - 1
      ].itemTerm?.[0].duration?.units,
  };

  useEffect(() => {
    form.resetFields();
    initialValues = {
      billingAccount: "test",
      characteristicName:
        editOrderData?.productOrderItem?.[
          editOrderData?.productOrderItem.length - 1
        ]?.product?.productCharacteristic?.[0].name,
      characteristicValue:
        editOrderData?.productOrderItem?.[
          editOrderData?.productOrderItem.length - 1
        ]?.product?.productCharacteristic?.[0].value,
      productSpecification:
        editOrderData?.productOrderItem?.[
          editOrderData?.productOrderItem.length - 1
        ]?.product?.productSpecification?.name,
      productOffering:
        editOrderData?.productOrderItem?.[
          editOrderData?.productOrderItem.length - 1
        ]?.productOffering?.name,
      priceType:
        editOrderData?.productOrderItem?.[
          editOrderData?.productOrderItem.length - 1
        ].itemPrice?.[0].priceType,
      dutyUnits:
        editOrderData?.productOrderItem?.[
          editOrderData?.productOrderItem.length - 1
        ].itemPrice?.[0].price?.dutyFreeAmount?.unit,
      dutyValue:
        editOrderData?.productOrderItem?.[
          editOrderData?.productOrderItem.length - 1
        ].itemPrice?.[0].price?.dutyFreeAmount?.amount,
      taxUnits:
        editOrderData?.productOrderItem?.[
          editOrderData?.productOrderItem.length - 1
        ].itemPrice?.[0].price?.taxIncludedAmount?.unit,
      taxValue:
        editOrderData?.productOrderItem?.[
          editOrderData?.productOrderItem.length - 1
        ].itemPrice?.[0].price?.taxIncludedAmount?.amount,
      termName:
        editOrderData?.productOrderItem?.[
          editOrderData?.productOrderItem.length - 1
        ].itemTerm?.[0].name,
      durationAmount:
        editOrderData?.productOrderItem?.[
          editOrderData?.productOrderItem.length - 1
        ].itemTerm?.[0].duration?.amount,
      durationUnits:
        editOrderData?.productOrderItem?.[
          editOrderData?.productOrderItem.length - 1
        ].itemTerm?.[0].duration?.units,
    };
  }, [editOrderData]);

  const onFinish = (values: any) => {
    const finalValues: ProductOrdering = {
      productOrderItem: [
        {
          product: {
            productCharacteristic: [
              {
                name: values.characteristicName,
                value: values.characteristicValue,
              },
            ],
            productSpecification: {
              name: values.productSpecification,
            },
          },
          productOffering: {
            name: values.productOffering,
          },
          itemPrice: [
            {
              priceType: values.priceType,
              price: {
                dutyFreeAmount: {
                  unit: values.dutyUnits,
                  amount: values.dutyValue,
                },
                taxIncludedAmount: {
                  unit: values.taxUnits,
                  amount: values.taxValue,
                },
              },
            },
          ],
          itemTerm: [
            {
              name: values.termName,
              duration: {
                amount: values.durationAmount,
                units: values.durationUnits,
              },
            },
          ],
        },
      ],
    };
    if (isEdit) {
      updateOrder.mutate(finalValues);
    } else {
      createOrder.mutate(finalValues);
    }
  };
  return (
    <FormDynamicRenderer
      form={form}
      scrollToFirstError={true}
      name="basic"
      labelAlign="left"
      labelWrap={false}
      size="middle"
      onFinish={onFinish}
      layout={"vertical"}
      justify={"start"}
      align={"top"}
      gutter={[20, 25]}
      initialValues={isEdit ? initialValues : {}}
    >
      {ProductOrderingFormUnits({}).map((unit, i) => (
        <>
          {i == 1 ? (
            <>
              <Col span={24}>
                <CustomBorderButtom>
                  <h3>{t(messages.product)}</h3>
                </CustomBorderButtom>
              </Col>
              <Col span={24}>
                <h4 className="text-primary">
                  {t(messages.productCharacteristic)}
                </h4>
              </Col>
              <FormElement {...unit} />
            </>
          ) : i == 5 ? (
            <>
              <Col span={24}>
                <CustomBorderButtom>
                  <h3>{t(messages.itemPrice)}</h3>
                </CustomBorderButtom>
              </Col>
              <FormElement {...unit} />
            </>
          ) : i == 6 ? (
            <>
              <Col span={24}>
                <h3 className="text-primary">{t(messages.dutyFreeAmount)}</h3>
              </Col>
              <FormElement {...unit} />
            </>
          ) : i == 8 ? (
            <>
              <Col span={24}>
                <h3 className="text-primary">
                  {t(messages.taxIncludedAmount)}
                </h3>
              </Col>
              <FormElement {...unit} />
            </>
          ) : i == 10 ? (
            <>
              <Col span={24}>
                <CustomBorderButtom>
                  <h3>{t(messages.itemTerm)}</h3>
                </CustomBorderButtom>
              </Col>
              <FormElement {...unit} />
            </>
          ) : i == 11 ? (
            <>
              <Col span={24}>
                <h3 className="text-primary">{t(messages.duration)}</h3>
              </Col>
              <FormElement {...unit} />
            </>
          ) : (
            <>
              <FormElement {...unit} />
            </>
          )}
        </>
      ))}
      <Col>
        <Button
          type="primary"
          htmlType="submit"
          className="bg-primary"
          loading={isEdit ? updateOrder.isLoading : createOrder.isLoading}
        >
          {t(messages.next)}
        </Button>
      </Col>
    </FormDynamicRenderer>
  );
};
export default ProductOrderingMainInfo;
