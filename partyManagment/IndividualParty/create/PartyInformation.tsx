import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import messages from "../messages";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

//components
import { Button, Col, Form } from "antd";
import { mainInfoUnit } from "./formUnits/mainInfoUnits";

//render form
import FormRenderer from "@/components/dynamic-render/Form-Render-Component/Form/Form";
import FormElement from "@/components/dynamic-render/Form-Render-Component/Form/FormElement";

//api
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PartyIndividualServices } from "../api";

//types
import { IindividualPartyRes } from "../type";
import { StepCopmonentProps } from "../../create/type";

//redux
import { useAppSelector } from "@/redux/hooks";
import { useDispatch } from "react-redux";
import { addMainInfo } from "@/redux/slices/partyManagment/individualParty.Slice";

//datepicker
import CustomDatePicker from "../../../../components/pure-elements/customDatePicker/index";
import dayjs from "dayjs";
import moment from "jalali-moment";
import { convertToEn } from "@/tools/pure-function/persianToEnglish";

const service = new PartyIndividualServices();

const PartyInformation = (props: StepCopmonentProps) => {
  const { onNext, onCompletedStep, stepNumber } = props;

  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const individualParty = useAppSelector((state) => state.individualParty);
  const { lang } = useAppSelector((state) => state.lang);
  const [form] = Form.useForm();

  const [birthDate, setBirthDate] = useState<string | Date>(
    dayjs().format("YYYY-MM-DD")
  );

  useEffect(() => {
    if (lang) {
      // Set persianBirthDate
      const persianBirthDate = new Date(
        individualParty?.birthDate || birthDate
      ).toLocaleDateString("fa-IR");

      setBirthDate(persianBirthDate);
    } else {
      setBirthDate(
        dayjs(individualParty?.birthDate || birthDate).format("YYYY-MM-DD")
      );
    }
  }, [individualParty]);

  const filterAge = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today;
  };

  //fetch hooks
  const mutation = useMutation({
    mutationFn: async (value: any) => {
      const data = await service.create(value);
      return data;
    },
    onSuccess: (res) => {
      onCompletedStep?.(stepNumber);
      queryClient.invalidateQueries({ queryKey: ["party", "individual"] });
      onNext();
      dispatch(addMainInfo(res.data));
    },
  });

  const { mutate: updateInfo } = useMutation({
    mutationFn: async (value: IindividualPartyRes) => {
      if (individualParty.id) {
        const data = await service.update(value, individualParty.id);
        return data;
      }
    },
    onSuccess: (res) => {
      onCompletedStep?.(stepNumber);
      queryClient.invalidateQueries({ queryKey: ["party", "individual"] });
      onNext();
      if (res) {
        dispatch(addMainInfo(res.data));
      }
    },
  });

  const handleFinishItem = (values: any) => {
    const finalValues = {
      ...values,
      birthDate: lang
        ? moment(convertToEn(birthDate), "jYYYY/jM/jD").format("YYYY-MM-DD")
        : birthDate,

      // countryOfBirth: "Iran",
      // nationality: "Iranian",
      maritalStatus: "Initialized",
    };
    if (individualParty?.id) {
      updateInfo(finalValues);
    } else {
      mutation.mutate(finalValues);
    }
  };

  const initialValues = {
    givenName: individualParty?.givenName,
    familyName: individualParty?.familyName,
    aristocraticTitle: individualParty?.aristocraticTitle,
    countryOfBirth: individualParty?.countryOfBirth,
    placeOfBirth: individualParty?.placeOfBirth,
  };

  return (
    <FormRenderer
      scrollToFirstError={true}
      name="basic"
      labelAlign="left"
      labelWrap={false}
      size="middle"
      onFinish={handleFinishItem}
      layout={"vertical"}
      justify={"start"}
      align={"top"}
      gutter={[20, 25]}
      initialValues={initialValues}
      form={form}
    >
      {mainInfoUnit({ data: individualParty, t, form }).map((unit, i) => (
        <>
          {/* Render DateTimePicker After Family Name */}
          {i == 3 ? (
            <>
              <Col span={12}>
                <CustomDatePicker
                  label={t(messages.birthDate)}
                  name={"birthDate"}
                  value={birthDate}
                  onChangeDate={setBirthDate}
                  width="100%"
                  minDate=""
                  maxDate={filterAge()}
                />
              </Col>
              <FormElement {...unit} />
            </>
          ) : (
            <FormElement {...unit} />
          )}
        </>
      ))}
      <Col>
        <Button className="flex items-center" htmlType="submit">
          {t(messages.next)}
          {lang ? <LeftOutlined /> : <RightOutlined />}
        </Button>
      </Col>
    </FormRenderer>
  );
};

export default PartyInformation;
