import { LocalSavePurchases } from "./local-save-purchases";
import { mockPurchases, CacheStoreSpy } from "@/data/tests";

type SutTypes = {
  sut: LocalSavePurchases;
  cacheStore: CacheStoreSpy;
};
const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalSavePurchases(cacheStore);

  return {
    sut,
    cacheStore,
  };
};

describe("LocalSavePurchases", () => {
  it("should not delete cache on sut.init", () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  it("should delete old cache on sut.save", async () => {
    const { sut, cacheStore } = makeSut();
    await sut.save(mockPurchases());
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deleteKey).toBe("purchases");
  });

  it("should not insert new cache if delete fails", () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateDeleteError();
    const promise = sut.save(mockPurchases());
    expect(cacheStore.insertCallsCount).toBe(0);
    expect(promise).rejects.toThrow();
  });

  it("should insert new cache if delete succeeds", async () => {
    const { sut, cacheStore } = makeSut();
    const purchases = mockPurchases();
    await sut.save(purchases);
    expect(cacheStore.insertCallsCount).toBe(1);
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.insertKey).toBe("purchases");
    expect(cacheStore.insertValues).toEqual(purchases);
  });

  it("should throw if insert throws", () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateInsertError();
    const promise = sut.save(mockPurchases());
    expect(promise).rejects.toThrow();
  });
});
