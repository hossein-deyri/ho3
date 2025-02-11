import { IIndividualPartyShahkar } from "@/types/model/entity/individualParty.model";
import {
  IContactMedium,
  IContactMediumObject,
  IIndividualpartyCharacteristic,
  IndividualIdentification,
  IndividualRelatedParty
} from "@/types/model/redux/individualParty";

export interface IindividualParty {
  givenName?: string;
  familyName?: string;
  aristocraticTitle?: string;
  birthDate?: string | Date;
  countryOfBirth?: string;
  deathDate?: string;
  familyNamePrefix?: string;
  fullName?: string;
  gender?: string;
  status?: string;
  generation?: string;
  legalName?: string;
  formattedName?: string;
  location?: string;
  maritalStatus?: string;
  middleName?: string;
  nationality?: string;
  placeOfBirth?: string;
  preferredGivenName?: string;
  title?: string;
  contactMedium: IContactMedium;
  individualIdentification?: IndividualIdentification[];
  partyCharacteristic?: IIndividualpartyCharacteristic[];
  orders?: IIndividualPartyShahkar[]
  relatedParty?: IndividualRelatedParty[]
}

export interface IIndividualPartyVerification {
  code?: string;
  contactMedium: IContactMediumObject;
}

export interface IindividualPartyRes extends IindividualParty {
  id: string;
  lastUpdate: string;
  version: string;
  href: string;
  "@baseType": string;
  "@schemaLocation": string;
}

