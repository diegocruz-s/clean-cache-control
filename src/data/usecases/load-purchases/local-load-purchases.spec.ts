import { CacheStoreSpy } from "@/data/tests";
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

  it("should call correct key on load", async () => {
    const { sut, cacheStore } = makeSut();
    await sut.loadAll();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe("purchases");
  });

  it("should return empty list if load fail", async () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateFetchError();
    const purchases = await sut.loadAll();
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ]);
    expect(cacheStore.deleteKey).toBe('purchases');
    expect(purchases).toEqual([]);
  });
});
