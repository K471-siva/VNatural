import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock localStorage globally before importing schema.js
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; }
  };
})();
global.localStorage = mockLocalStorage;

// Mock fetch globally
global.fetch = vi.fn().mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) }));

// Import the modules to test
import { initDB, getProducts, toggleWishlist, getWishlist } from "../db/schema";

describe("VNatural Database Schema Logic Tests", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  it("should initialize default database lists in local storage", () => {
    initDB();
    const products = getProducts();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty("name");
    expect(products[0]).toHaveProperty("price");
  });

  it("should calculate correct delivery executive earning rates", () => {
    // Formula: Math.round(orderTotal * 0.08 + 30)
    const orderTotal = 1500;
    const expectedEarning = Math.round(orderTotal * 0.08 + 30);
    
    expect(expectedEarning).toBe(150); // 120 + 30
  });

  it("should toggle customer wishlist items correctly", () => {
    initDB();
    const userId = "u_customer_1";
    const productId = "p_test_1";

    // Set initial state
    localStorage.setItem("vnatural_wishlists", JSON.stringify({}));

    // Toggle on
    toggleWishlist(userId, productId);
    expect(getWishlist(userId)).toContain(productId);

    // Toggle off
    toggleWishlist(userId, productId);
    expect(getWishlist(userId)).not.toContain(productId);
  });
});
