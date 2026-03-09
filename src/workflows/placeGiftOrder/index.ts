import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { validateLogisticsStep, ValidateLogisticsInput } from "./steps/validateLogisticsStep";
import { reserveDeliveryStep, ReserveDeliveryInput } from "./steps/reserveDeliveryStep";
import { createOrderStep, CreateOrderInput } from "./steps/createOrderStep";
import { linkGiftingDataStep, LinkGiftingDataInput } from "./steps/linkGiftingDataStep";
import { emitOrderPlacedStep, EmitOrderPlacedInput } from "./steps/emitOrderPlacedStep";
import { checkHealth } from "./logisticsClient";

export interface PlaceGiftOrderInput {
    // Address validation
    sector: string;
    city: string;
    province?: string;
    // Delivery slot
    date: string;
    startTime: string;
    // Order
    cartId: string;
    customerId?: string;
    // Gift recipient
    recipientName: string;
    recipientPhone: string;
    videoUrl?: string;
    deliveryAddress: string;
}

export const placeGiftOrderWorkflow = createWorkflow(
    "place-gift-order-workflow",
    (input: PlaceGiftOrderInput) => {
        // Step 1: Validate address with the logistics service
        const validationResult = validateLogisticsStep({
            sector: input.sector,
            city: input.city,
            province: input.province,
        });

        // Step 2: Reserve a delivery slot (with saga compensation)
        const reservationResult = reserveDeliveryStep({
            zoneId: validationResult.zoneId,
            date: input.date,
            startTime: input.startTime,
            referenceId: input.cartId,
        });

        // Step 3: Create the Medusa order
        const orderResult = createOrderStep({
            cartId: input.cartId,
            customerId: input.customerId,
        });

        // Step 4: Link gifting data to the order
        const linkResult = linkGiftingDataStep({
            orderId: orderResult.orderId,
            recipientName: input.recipientName,
            recipientPhone: input.recipientPhone,
            videoUrl: input.videoUrl,
            deliveryId: reservationResult.slotId,
        });

        // Step 5: Emit order.placed event (async, for logistics dispatch)
        const emitResult = emitOrderPlacedStep({
            orderId: orderResult.orderId,
            zoneId: validationResult.zoneId,
            slotId: reservationResult.slotId,
            recipientName: input.recipientName,
            recipientPhone: input.recipientPhone,
            deliveryAddress: input.deliveryAddress,
        });

        return new WorkflowResponse({
            orderId: orderResult.orderId,
            zoneId: validationResult.zoneId,
            slotId: reservationResult.slotId,
            giftingDataId: linkResult.giftingDataId,
            eventEmitted: emitResult.emitted,
        });
    },
);
