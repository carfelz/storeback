import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { validateAddress, ValidateAddressPayload, ValidateAddressResponse } from "../logisticsClient";

export interface ValidateLogisticsInput {
    sector: string;
    city: string;
    province?: string;
}

export const validateLogisticsStep = createStep(
    "validate-logistics-step",
    async (input: ValidateLogisticsInput): Promise<StepResponse<ValidateAddressResponse>> => {
        const payload: ValidateAddressPayload = {
            sector: input.sector,
            city: input.city,
            province: input.province,
        };

        const result = await validateAddress(payload);

        return new StepResponse(result);
    },
);
