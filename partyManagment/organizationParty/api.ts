import { IOrganizationParty, IVerifyCode } from "@/types/model/redux/organizationParty";
import { IOrganizationPartyConstants, IOrganizationPartyRes } from "@/types/model/entity/organizationParty.model";
import { CrudTmForumService } from "@/services/_crud-tm-service";

export class organizationPartyServices extends CrudTmForumService<
  IOrganizationPartyRes,
  IOrganizationParty,
  IOrganizationParty
> {
  entityBaseUrl = "partyManagement";
  versionName = "v4";
  entityName = "organization";
}


export class OrganizationPartyConstantsService extends CrudTmForumService<
  IOrganizationPartyConstants,
  IOrganizationPartyConstants,
  IOrganizationPartyConstants
> {
  entityBaseUrl = "partyManagement";
  versionName = "v4";
  entityName = "constants";
}

export class OrganizationVerificationService extends CrudTmForumService<
IVerifyCode,
IVerifyCode,
IVerifyCode
> {
  entityBaseUrl = "partyManagement";
  versionName = "v4";
  entityName = "organization";
}