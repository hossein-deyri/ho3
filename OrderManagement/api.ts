import {
  ProductOrdering,
  ProductOrderingRes,
} from "@/types/model/entity/productOrdering.model";
import { CrudTmForumService } from "@/services/_crud-tm-service";

export class ProductOrderingServices extends CrudTmForumService<
  ProductOrderingRes,
  ProductOrdering,
  ProductOrdering
> {
  entityBaseUrl = "productOrderingManagement";
  versionName = "v4";
  entityName = "productOrder";
}
