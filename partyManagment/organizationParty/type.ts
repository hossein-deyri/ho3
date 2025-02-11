import {
  IExternalReference,
  IOrganizationpartyCharacteristic,
  IOrganizationIdentification,
  ICreditRating,
  IOrganizationRelatedParty,
  IContactMedium,
  IOrganizationChildRelationship,
} from "@/types/model/redux/organizationParty";
export interface IOrganizationParty {
  id: string;
  lastUpdate: string;
  version: number;
  name: string;
  href: string;
  isLegalEntity: boolean;
  isHeadOffice: boolean;
  organizationType: string;
  existsDuring: {
    startDateTime: any;
    endDateTime: null;
  };
  tradingName: string;
  nameType: string;
  externalReference: IExternalReference[];
  partyCharacteristic: IOrganizationpartyCharacteristic[];
  organizationIdentification: IOrganizationIdentification[];
  creditRating: ICreditRating[];
  relatedParty: IOrganizationRelatedParty[];
  contactMedium: IContactMedium[];
  organizationParentRelationship: {
    relationshipType: string;
    organization: {
      id: string;
      href: string;
    };
  };
  organizationChildRelationship: IOrganizationChildRelationship[];
  status: string;
  "@baseType": string;
  "@schemaLocation": string;
}


