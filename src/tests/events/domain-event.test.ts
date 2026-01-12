import { describe, it, expect, vi, beforeEach } from "vitest";
import { domainEventEmitter, createDomainEvent } from "@/domain/events/domain-event";

describe("domainEventEmitter", () => {
  beforeEach(() => {
    domainEventEmitter.clear();
    vi.clearAllMocks();
  });

  it("registers and unregisters handlers with on/off/clear", () => {
    const handler = vi.fn();
    const unsubscribe = domainEventEmitter.on("TestEvent", handler);

    expect(domainEventEmitter.handlerCount("TestEvent")).toBe(1);

    unsubscribe();
    expect(domainEventEmitter.handlerCount("TestEvent")).toBe(0);

    // Add two handlers and clear all
    domainEventEmitter.on("TestEvent", handler);
    domainEventEmitter.on("OtherEvent", handler);
    domainEventEmitter.clear();
    expect(domainEventEmitter.handlerCount("TestEvent")).toBe(0);
    expect(domainEventEmitter.handlerCount("OtherEvent")).toBe(0);
  });

  it("emits events to all handlers even when one throws", () => {
    const okHandler = vi.fn();
    const badHandler = vi.fn(() => {
      throw new Error("boom");
    });
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    domainEventEmitter.on("TestEvent", badHandler);
    domainEventEmitter.on("TestEvent", okHandler);

    domainEventEmitter.emit(
      createDomainEvent("TestEvent", { foo: "bar" })
    );

    expect(okHandler).toHaveBeenCalledTimes(1);
    expect(badHandler).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("catches async handler rejections without stopping other handlers", async () => {
    const asyncBad = vi.fn(async () => {
      throw new Error("async boom");
    });
    const asyncOk = vi.fn(async () => Promise.resolve());
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    domainEventEmitter.on("TestEvent", asyncBad);
    domainEventEmitter.on("TestEvent", asyncOk);

    domainEventEmitter.emit(createDomainEvent("TestEvent", { foo: "bar" }));

    // allow async handlers to run
    await vi.waitFor(() => {
      expect(asyncBad).toHaveBeenCalled();
      expect(asyncOk).toHaveBeenCalled();
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});


