import { model } from "@medusajs/framework/utils";

const GiftingData = model.define("gifting_data", {
    id: model.id().primaryKey(),
    recipientName: model.text(),
    recipientPhone: model.text(),
    videoUrl: model.text().nullable(),
    deliveryId: model.text().nullable(),
    deliveryStatus: model.text().default("PENDING"),
    notes: model.text().nullable(),
});

export default GiftingData;
