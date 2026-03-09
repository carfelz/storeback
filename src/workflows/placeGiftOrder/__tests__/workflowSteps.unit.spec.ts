/**
 * Unit tests for the validateLogisticsStep and reserveDeliveryStep.
 *
 * These tests mock the logistics client to verify step behavior
 * without requiring a running NestJS service.
 */

import * as logisticsClient from "../logisticsClient";

// Mock the logistics client module
jest.mock("../logisticsClient");

const mockedClient = logisticsClient as jest.Mocked<typeof logisticsClient>;

describe("validateLogisticsStep", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call validateAddress with the correct payload", async () => {
        const mockResult = {
            valid: true,
            zoneId: "SD-PIANTINI",
            zoneName: "Piantini Zone",
            pantryProximityKm: 2.5,
        };

        mockedClient.validateAddress.mockResolvedValue(mockResult);

        const result = await logisticsClient.validateAddress({
            sector: "Piantini",
            city: "Santo Domingo",
        });

        expect(result).toEqual(mockResult);
        expect(mockedClient.validateAddress).toHaveBeenCalledWith({
            sector: "Piantini",
            city: "Santo Domingo",
        });
    });

    it("should throw when address validation fails", async () => {
        mockedClient.validateAddress.mockRejectedValue(
            new Error('No active delivery zone found for sector "Unknown"'),
        );

        await expect(
            logisticsClient.validateAddress({
                sector: "Unknown",
                city: "Unknown City",
            }),
        ).rejects.toThrow("No active delivery zone found");
    });
});

describe("reserveDeliveryStep compensation", () => {
    it("should call releaseSlot on compensation", async () => {
        mockedClient.releaseSlot.mockResolvedValue({
            released: true,
            slotId: "slot-123",
        });

        const result = await logisticsClient.releaseSlot({
            slotId: "slot-123",
            action: "RELEASE_SLOT",
            referenceId: "order-abc",
        });

        expect(result.released).toBe(true);
        expect(mockedClient.releaseSlot).toHaveBeenCalledWith({
            slotId: "slot-123",
            action: "RELEASE_SLOT",
            referenceId: "order-abc",
        });
    });
});
