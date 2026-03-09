import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

export interface EmitOrderPlacedInput {
    orderId: string;
    zoneId: string;
    slotId: string;
    recipientName: string;
    recipientPhone: string;
    deliveryAddress: string;
}

export interface EmitOrderPlacedResult {
    emitted: boolean;
    channel: string;
    orderId: string;
}

/**
 * Step 5 (Async): Emit 'order.placed' event.
 *
 * In production, this would publish to GCP Pub/Sub.
 * Currently implemented as a stub using Medusa's event bus
 * for the Logistics service to begin dispatching.
 */
export const emitOrderPlacedStep = createStep(
    "emit-order-placed-step",
    async (
        input: EmitOrderPlacedInput,
        { container },
    ): Promise<StepResponse<EmitOrderPlacedResult>> => {
        // Use Medusa's built-in event bus as a Pub/Sub stub
        const eventBus = container.resolve("event_bus");

        await eventBus.emit([{
            name: "order.gift_placed",
            data: {
                orderId: input.orderId,
                zoneId: input.zoneId,
                slotId: input.slotId,
                recipientName: input.recipientName,
                recipientPhone: input.recipientPhone,
                deliveryAddress: input.deliveryAddress,
                timestamp: new Date().toISOString(),
            },
        }]);

        return new StepResponse({
            emitted: true,
            channel: "order.gift_placed",
            orderId: input.orderId,
        });
    },
);
