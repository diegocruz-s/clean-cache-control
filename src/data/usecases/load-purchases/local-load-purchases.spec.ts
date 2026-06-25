import { CacheStoreSpy, mockPurchases } from "@/data/tests";
import { LocalPurchasesManager } from "./local-load-purchases";

type SutTypes = {
  sut: LocalPurchasesManager;
  cacheStore: CacheStoreSpy;
};
const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalPurchasesManager(cacheStore, timestamp);

  return {
    sut,
    cacheStore,
  };
};

describe("LocalPurchasesManager", () => {
  it("should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.actions).toEqual([]);
  });
});
