import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import {
    reserveSlot,
    releaseSlot,
    ReserveSlotPayload,
    ReserveSlotResponse,
} from "../logisticsClient";

export interface ReserveDeliveryInput {
    zoneId: string;
    date: string;
    startTime: string;
    referenceId: string;
}

export const reserveDeliveryStep = createStep(
    "reserve-delivery-step",
    async (input: ReserveDeliveryInput): Promise<StepResponse<ReserveSlotResponse, ReserveSlotResponse>> => {
        const payload: ReserveSlotPayload = {
            zoneId: input.zoneId,
            date: input.date,
            startTime: input.startTime,
            referenceId: input.referenceId,
        };

        const result = await reserveSlot(payload);

        // Return compensation data so the slot can be released on failure
        return new StepResponse(result, result);
    },
    // Compensation function: release the slot (Saga Pattern)
    async (compensationData: ReserveSlotResponse) => {
        await releaseSlot({
            slotId: compensationData.slotId,
            action: "RELEASE_SLOT",
            referenceId: compensationData.lockedBy,
        });
    },
);
