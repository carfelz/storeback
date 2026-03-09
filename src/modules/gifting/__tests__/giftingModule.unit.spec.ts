import GiftingModuleService from "../service";
import { moduleIntegrationTestRunner } from "@medusajs/test-utils";
import { GIFTING_MODULE } from "../index";

jest.setTimeout(100000);

moduleIntegrationTestRunner<GiftingModuleService>({
    moduleName: GIFTING_MODULE,
    moduleOptions: {},
    testSuite: ({ service }) => {
        describe("GiftingModuleService", () => {
            it("should be able to create and retrieve gifting data", async () => {
                // Create gifting data
                const created = await service.createGiftingDatas({
                    recipientName: "John Doe",
                    recipientPhone: "+1234567890",
                    videoUrl: "https://example.com/video.mp4",
                });

                expect(created).toBeDefined();
                expect(created.id).toBeDefined();
                expect(created.recipientName).toBe("John Doe");

                // Retrieve gifting data
                const retrieved = await service.retrieveGiftingData(created.id);

                expect(retrieved).toBeDefined();
                expect(retrieved.id).toBe(created.id);
                expect(retrieved.recipientPhone).toBe("+1234567890");
            });

            it("should be able to update gifting data", async () => {
                const created = await service.createGiftingDatas({
                    recipientName: "Jane Doe",
                    recipientPhone: "+1987654321",
                });

                const updated = await service.updateGiftingDatas({
                    id: created.id,
                    deliveryStatus: "DISPATCHED",
                    deliveryId: "slot-123"
                });

                expect(updated).toBeDefined();
                expect(updated.deliveryStatus).toBe("DISPATCHED");
                expect(updated.deliveryId).toBe("slot-123");
            });

            it("should be able to delete gifting data", async () => {
                const created = await service.createGiftingDatas({
                    recipientName: "To Delete",
                    recipientPhone: "000000",
                });

                await service.deleteGiftingDatas(created.id);

                const list = await service.listGiftingDatas({ id: created.id });
                expect(list.length).toBe(0);
            });
        });
    },
});
