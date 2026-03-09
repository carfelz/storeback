import axios, { AxiosInstance, AxiosResponse } from "axios";

export interface ValidateAddressPayload {
    sector: string;
    city: string;
    province?: string;
}

export interface ValidateAddressResponse {
    valid: boolean;
    zoneId: string;
    zoneName: string;
    pantryProximityKm: number;
}

export interface ReserveSlotPayload {
    zoneId: string;
    date: string;
    startTime: string;
    referenceId: string;
}

export interface ReserveSlotResponse {
    slotId: string;
    zoneId: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    lockedBy: string;
}

export interface ReleaseSlotPayload {
    slotId: string;
    action: "RELEASE_SLOT";
    referenceId: string;
}

export interface DispatchPayload {
    orderId: string;
    slotId: string;
    zoneId: string;
    courierType?: "PEDIDOS_YA" | "MANUAL";
    deliveryAddress: string;
    recipientName: string;
    recipientPhone: string;
}

export interface DispatchResponse {
    dispatchId: string;
    orderId: string;
    status: string;
    courierType: string;
    trackingCode: string | null;
    estimatedArrival: string;
    message: string;
}

export interface HealthResponse {
    status: string;
}

function createLogisticsClient(): AxiosInstance {
    const baseURL = process.env.LOGISTICS_SERVICE_URL ?? "http://localhost:3001";
    const apiKey = process.env.INTERNAL_API_KEY ?? "";

    return axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
        },
    });
}

const logisticsClient = createLogisticsClient();

export async function checkHealth(): Promise<HealthResponse> {
    const response: AxiosResponse<HealthResponse> =
        await logisticsClient.get("/health");
    return response.data;
}

export async function validateAddress(
    payload: ValidateAddressPayload,
): Promise<ValidateAddressResponse> {
    const response: AxiosResponse<ValidateAddressResponse> =
        await logisticsClient.post("/v1/logistics/validate-address", payload);
    return response.data;
}

export async function reserveSlot(
    payload: ReserveSlotPayload,
): Promise<ReserveSlotResponse> {
    const response: AxiosResponse<ReserveSlotResponse> =
        await logisticsClient.post("/v1/logistics/reserve-slot", payload);
    return response.data;
}

export async function releaseSlot(
    payload: ReleaseSlotPayload,
): Promise<{ released: boolean; slotId: string }> {
    const response: AxiosResponse<{ released: boolean; slotId: string }> =
        await logisticsClient.post("/v1/logistics/release-slot", payload);
    return response.data;
}

export async function dispatch(
    payload: DispatchPayload,
): Promise<DispatchResponse> {
    const response: AxiosResponse<DispatchResponse> =
        await logisticsClient.post("/v1/logistics/dispatch", payload);
    return response.data;
}
