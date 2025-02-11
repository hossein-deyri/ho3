import { IIndividualPartyConstants } from "@/types/model/entity/individualParty.model";
import { IOrganizationPartyConstants } from "@/types/model/entity/organizationParty.model";
import { CrudTmForumService } from "@/services/_crud-tm-service";

export class IndividualPartyConstantsService extends CrudTmForumService<
  IIndividualPartyConstants,
  IIndividualPartyConstants,
  IIndividualPartyConstants
> {
  entityBaseUrl = "partyManagement";
  versionName = "v4";
  entityName = "constants";
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