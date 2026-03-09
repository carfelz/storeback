import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
    placeGiftOrderWorkflow,
    PlaceGiftOrderInput,
} from "../../../workflows/placeGiftOrder";
import { checkHealth } from "../../../workflows/placeGiftOrder/logisticsClient";

interface GiftOrderRequestBody {
    sector: string;
    city: string;
    province?: string;
    date: string;
    startTime: string;
    cartId: string;
    customerId?: string;
    recipientName: string;
    recipientPhone: string;
    videoUrl?: string;
    deliveryAddress: string;
}

export async function POST(
    req: MedusaRequest<GiftOrderRequestBody>,
    res: MedusaResponse,
): Promise<void> {
    try {
        // Health check gate: ensure logistics service is live
        try {
            await checkHealth();
        } catch {
            res.status(503).json({
                error: "Logistics service is unavailable. Please try again later.",
            });
            return;
        }

        const input: PlaceGiftOrderInput = {
            sector: req.body.sector,
            city: req.body.city,
            province: req.body.province,
            date: req.body.date,
            startTime: req.body.startTime,
            cartId: req.body.cartId,
            customerId: req.body.customerId,
            recipientName: req.body.recipientName,
            recipientPhone: req.body.recipientPhone,
            videoUrl: req.body.videoUrl,
            deliveryAddress: req.body.deliveryAddress,
        };

        const { result } = await placeGiftOrderWorkflow(req.scope).run({
            input,
        });

        res.status(201).json(result);
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(400).json({ error: message });
    }
}
