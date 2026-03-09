import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { GIFTING_MODULE } from "../../../modules/gifting";

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse,
): Promise<void> {
    const giftingService = req.scope.resolve(GIFTING_MODULE);
    const giftingData = await giftingService.listGiftingDatas();

    res.json({ gifting_data: giftingData });
}
