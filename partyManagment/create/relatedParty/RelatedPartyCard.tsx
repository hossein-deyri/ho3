import { IndividualRelatedParty } from "@/types/model/redux/individualParty";

import { BankOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Divider, Popconfirm } from "antd";
import { t } from "i18next";
import messages from './messages';

interface Props extends IndividualRelatedParty {
  onRemove: (id: string) => void;
}

const RelatedPartyCard = (props: Props) => {

  const { onRemove } = props;

  return (
    <Card
      headStyle={{ height: "20px" }}
      bodyStyle={{
        padding: "30px",
      }}
      className="shadow-md"
    >
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex gap-2">
          <span className="text-iconColor"> {props["@referredType"] === "Individual" || props["@referredType"] === "individual" ?  <UserOutlined  /> : <BankOutlined  /> } </span>
          <span>{props.name}</span>
        </div>
       <div className="flex gap-2">
        </div>
        <div className="flex gap-2">
          <span className="text-iconColor">{t(messages.role)} : </span>
          <span>{t(props.role ||"")}</span>
        </div>
       
      </div>
      <Divider />
      <div className="flex justify-start text-gray">
        {/* <span className="cursor-pointer" onClick={() => onRemove(props.id || '')}>
          <DeleteOutlined   />
        </span> */}
        <Popconfirm
            title= {t(messages.sureToDelete)}
            onConfirm={() => onRemove(props.id || "")}
            okText={t(messages.yes)}
            cancelText={t(messages.no)}
          >
            <DeleteOutlined />
          </Popconfirm>
      </div>
    </Card>
  );
};

export default RelatedPartyCard;
