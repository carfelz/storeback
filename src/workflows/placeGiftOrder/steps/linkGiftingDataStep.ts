import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { GIFTING_MODULE } from "../../../modules/gifting";

export interface LinkGiftingDataInput {
    orderId: string;
    recipientName: string;
    recipientPhone: string;
    videoUrl?: string;
    deliveryId?: string;
}

export interface LinkGiftingDataResult {
    giftingDataId: string;
    orderId: string;
    linked: boolean;
}

export const linkGiftingDataStep = createStep(
    "link-gifting-data-step",
    async (
        input: LinkGiftingDataInput,
        { container },
    ): Promise<StepResponse<LinkGiftingDataResult>> => {
        // 1. Create the gifting data record
        const giftingService = container.resolve(GIFTING_MODULE);
        const giftingData = await giftingService.createGiftingDatas({
            recipientName: input.recipientName,
            recipientPhone: input.recipientPhone,
            videoUrl: input.videoUrl ?? null,
            deliveryId: input.deliveryId ?? null,
        });

        // 2. Link the gifting data to the order via the remote link
        const link = container.resolve(ContainerRegistrationKeys.LINK);
        await link.create({
            [Modules.ORDER]: { order_id: input.orderId },
            [GIFTING_MODULE]: { gifting_data_id: giftingData.id },
        });

        return new StepResponse({
            giftingDataId: giftingData.id,
            orderId: input.orderId,
            linked: true,
        });
    },
);
