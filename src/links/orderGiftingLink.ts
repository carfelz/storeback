import { defineLink } from "@medusajs/framework/utils";
import OrderModule from "@medusajs/medusa/order";
import GiftingModule from "../modules/gifting";

export default defineLink(
    OrderModule.linkable.order,
    GiftingModule.linkable.giftingData,
);
