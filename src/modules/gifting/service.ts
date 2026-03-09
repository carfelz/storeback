import { MedusaService } from "@medusajs/framework/utils";
import GiftingData from "./models/giftingData";

class GiftingModuleService extends MedusaService({
    GiftingData,
}) { }

export default GiftingModuleService;
