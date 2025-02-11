import { CrudTmForumService } from "@/services/_crud-tm-service";
import {
  IIndividualPartyConstants,
  IIndividualPartyShahkar,
} from "@/types/model/entity/individualParty.model";
import { IindividualParty, IindividualPartyRes, IIndividualPartyVerification } from "./type";
import { IVerifyCode } from "@/types/model/redux/individualParty";

export class PartyIndividualServices extends CrudTmForumService<
  IindividualPartyRes,
  IindividualParty,
  IindividualParty
> {
  entityBaseUrl = "partyManagement";
  versionName = "v4";
  entityName = "individual";
}
export class IndividualPartyConstantsService extends CrudTmForumService<
  IIndividualPartyConstants,
  IIndividualPartyConstants,
  IIndividualPartyConstants
> {
  entityBaseUrl = "partyManagement";
  versionName = "v4";
  entityName = "constants";
}

export class IndividualPartyShahkarService extends CrudTmForumService<
  IIndividualPartyShahkar,
  IIndividualPartyShahkar,
  IIndividualPartyShahkar
> {
  entityBaseUrl = "partyManagement";
  versionName = "v4";
  entityName = "shahkar";
}
export class IndividualVerificationService extends CrudTmForumService<
IVerifyCode,
IVerifyCode,
IVerifyCode
> {
  entityBaseUrl = "partyManagement";
  versionName = "v4";
  entityName = "individual";
}
