import FormRenderer from "@/components/dynamic-render/Form-Render-Component/Form/Form";
import FormElement from "@/components/dynamic-render/Form-Render-Component/Form/FormElement";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button, Col, Divider } from "antd";
import dayjs from "dayjs";
import moment from "jalali-moment";

import { useTranslation } from "react-i18next";
import {
  OrganizationPartyConstantsService,
  organizationPartyServices,
} from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IOrganizationParty } from "@/types/model/redux/organizationParty";
import { addMainInfo } from "@/redux/slices/partyManagment/organizationParty.slice";
import { IOrganizationPartyRes } from "@/types/model/entity/organizationParty.model";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { StepCopmonentProps } from "../../create/type";
import { useEffect, useState } from "react";
import CustomDatePicker from "../../../../components/pure-elements/customDatePicker/index";
import { convertToEn } from "@/tools/pure-function/persianToEnglish";
import messages from "../messages";
import { MainInfoUnit,OtherNameFormUnits } from "./formUnits/mainInfoUnits";


const constantsServices = new OrganizationPartyConstantsService();
const services = new organizationPartyServices();

const MainInfo = (props: StepCopmonentProps) => {
  const { onNext, onCompletedStep, stepNumber } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const organizationParty = useAppSelector((state) => state.organizationParty);
  const { lang } = useAppSelector((state) => state.lang);

  const [existDuringStart, setExistDuringStart] = useState<string | Date>(
    dayjs().format("YYYY-MM-DD")
  );

  const [existDuringEnd, setExistDuringEnd] = useState<string | Date>(
    dayjs().format("YYYY-MM-DD")
  );

  const [otherNameStartDuring, setOtherNameStartDuring] = useState<
    string | Date
  >(dayjs().format("YYYY-MM-DD"));

  const [otherNameEndDuring, setOtherNameEndDuring] = useState<string | Date>(
    dayjs().format("YYYY-MM-DD")
  );

  useEffect(() => {
    if (lang) {
      // Set persianExistDuringStart
      const persianExistDuringStart = new Date(
        organizationParty?.existsDuring?.startDateTime || existDuringStart
      ).toLocaleDateString("fa-IR");
      setExistDuringStart(persianExistDuringStart);

      // Set persianExistDuringEnd
      const persianExistDuringEnd = new Date(
        organizationParty?.existsDuring?.endDateTime || existDuringEnd
      ).toLocaleDateString("fa-IR");
      setExistDuringEnd(persianExistDuringEnd);

      // Set otherNameStartDuring
      const persianOtherNameStartDuring = new Date(
        organizationParty?.otherName?.validFor?.startDateTime ||
          otherNameStartDuring
      ).toLocaleDateString("fa-IR");
      setOtherNameStartDuring(persianOtherNameStartDuring);

      // Set otherNameEndDuring
      const persianOtherNameEndDuring = new Date(
        organizationParty?.otherName?.validFor?.endDateTime ||
          otherNameEndDuring
      ).toLocaleDateString("fa-IR");
      setOtherNameEndDuring(persianOtherNameEndDuring);
    } else {
      setExistDuringStart(
        dayjs(
          organizationParty?.existsDuring?.startDateTime || existDuringStart
        ).format("YYYY-MM-DD")
      );

      setExistDuringEnd(
        dayjs(
          organizationParty?.existsDuring?.endDateTime || existDuringEnd
        ).format("YYYY-MM-DD")
      );

      setOtherNameStartDuring(
        dayjs(
          organizationParty?.otherName?.validFor?.startDateTime ||
            otherNameStartDuring
        ).format("YYYY-MM-DD")
      );

      setOtherNameEndDuring(
        dayjs(
          organizationParty?.otherName?.validFor?.endDateTime ||
            otherNameEndDuring
        ).format("YYYY-MM-DD")
      );
    }
  }, [organizationParty]);

  const dispatch = useAppDispatch();

  const { mutate } = useMutation({
    mutationFn: async (value: IOrganizationParty) => {
      const data = await services.create(value);
      return data;
    },
    onSuccess: (data) => {
      dispatch(addMainInfo(data.data));
      onNext?.();
      queryClient.invalidateQueries({
        queryKey: ["party", "organization", ""],
        exact: true,
      });
      onCompletedStep?.(stepNumber);
    },
  });

  const { mutate: updateInfo } = useMutation({
    mutationFn: async (value: IOrganizationPartyRes) => {
      if (organizationParty.id) {
        const data = await services.update(value, organizationParty.id);
        return data;
      }
    },
    onSuccess: (res) => {
      onNext?.();
      if (res) {
        dispatch(addMainInfo(res.data));
      }
      queryClient.invalidateQueries({
        queryKey: ['"party", "organization"'],
        exact: true,
      });
      onCompletedStep?.(stepNumber);
    },
  });

  const handleFinish = (values: any) => {
    const finalValues = {
      isLegalEntity: values.isLegalEntity,
      isHeadOffice: values.isHeadOffice,
      organizationType: values.organizationType,
      existsDuring: {
        startDateTime: lang
          ? moment(convertToEn(existDuringStart), "jYYYY/jM/jD").format(
              "YYYY-MM-DD"
            )
          : existDuringStart,
        endDateTime: lang
          ? moment(convertToEn(existDuringEnd), "jYYYY/jM/jD").format(
              "YYYY-MM-DD"
            )
          : existDuringEnd,
      },
      tradingName: values.tradingName,
      name: values.name,
      nameType: values.nameType,
      otherName: {
        nameType: values.otherNameNameType,
        tradingName: values.otherNameTradingName,
        name: values.otherNameName,
        validFor: {
          startDateTime: lang
            ? moment(convertToEn(otherNameStartDuring), "jYYYY/jM/jD").format(
                "YYYY-MM-DD"
              )
            : otherNameStartDuring,
          endDateTime: lang
            ? moment(convertToEn(otherNameEndDuring), "jYYYY/jM/jD").format(
                "YYYY-MM-DD"
              )
            : otherNameEndDuring,
        },
      },
    };

    if (organizationParty.id) {
      updateInfo(finalValues);
    } else {
      mutate(finalValues);
    }
  };

  const nameType = [{ id: 1, name: "inc" }];

  const { data: organizationTypeData } = useQuery({
    queryFn: async () => {
      const data = await constantsServices.getList({
        type: "ORGANIZATION_TYPE",
      });
      return data.data;
    },
  });

  const initialValues = {
    tradingName: organizationParty?.tradingName,
  };

  return (
    <FormRenderer
      scrollToFirstError={true}
      name="basic"
      labelAlign="left"
      labelWrap={false}
      size="middle"
      onFinish={handleFinish}
      layout={"vertical"}
      justify={"start"}
      align={"top"}
      gutter={[20, 25]}
      initialValues={initialValues}
    >
      {MainInfoUnit({ t, organizationTypeData, nameType }).map((unit, i) => (
        <>
          {/* Render DateTimePicker After Organization Type */}
          {i == 2 ? (
            <>
              <Col span={12}>
                <CustomDatePicker
                  label={t(messages.registerCompanyDate)}
                  name="startDuring"
                  value={existDuringStart}
                  onChangeDate={setExistDuringStart}
                  width="100%"
                  minDate=""
                  maxDate={new Date()}
                />
              </Col>
              <Col span={12}>
                <CustomDatePicker
                  label={t(messages.existsDuringEnd)}
                  name="endDuring"
                  value={existDuringEnd}
                  onChangeDate={setExistDuringEnd}
                  width="100%"
                  minDate={new Date()}
                  maxDate=""
                />
              </Col>
              <FormElement {...unit} />
            </>
          ) : (
            <FormElement {...unit} />
          )}
        </>
      ))}

      <Col span={24}>
        <h3 className="block font-bold text-lg">{t(messages.otherName)}</h3>
      </Col>
      <Divider rootClassName="m-0" />

      {OtherNameFormUnits({ t, organizationTypeData, nameType }).map((unit, i) => (
        <FormElement {...unit} />
      ))}
      <Col span={8}>
        <CustomDatePicker
          label={t(messages.registerCompanyDate)}
          name="otherNameStartDuring"
          value={otherNameStartDuring}
          onChangeDate={setOtherNameStartDuring}
          width="100%"
          minDate=""
          maxDate={new Date()}
        />
      </Col>
      <Col span={8}>
        <CustomDatePicker
          label={t(messages.existsDuringEnd)}
          name="otherNameEndDuring"
          value={otherNameEndDuring}
          onChangeDate={setOtherNameEndDuring}
          width="100%"
          minDate={new Date()}
          maxDate=""
        />
      </Col>
      <Col span={24}>
        <Button htmlType="submit" className="flex items-center">
          {t(messages.next)}
          {lang ? <LeftOutlined /> : <RightOutlined />}
        </Button>
      </Col>
    </FormRenderer>
  );
};

export default MainInfo;
