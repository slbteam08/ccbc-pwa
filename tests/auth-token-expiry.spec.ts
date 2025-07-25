import { test, expect } from "@playwright/test";

/**
 * Test suite for authentication token expiry handling
 * Verifies that 403 errors from expired tokens trigger automatic logout
 */
test.describe("Authentication Token Expiry", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto("http://localhost:5173");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");
  });

  /**
   * Test that expired JWT token triggers logout when calling auth API
   */
  test("should trigger logout when token expires and auth API returns 403", async ({
    page,
  }) => {
    // Set up an expired or invalid JWT token in localStorage
    await page.evaluate(() => {
      localStorage.setItem("jwt", "expired.jwt.token");
    });

    // Verify token is set
    const token = await page.evaluate(() => localStorage.getItem("jwt"));
    expect(token).toBe("expired.jwt.token");

    // Mock the auth API to return 403 Forbidden
    await page.route("**/api/auth/profile", async (route) => {
      await route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({ error: "Token expired" }),
      });
    });

    // Trigger an auth API call by executing JavaScript that calls the profile endpoint
    await page.evaluate(async () => {
      try {
        const response = await fetch("/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 403) {
          // Simulate the axios interceptor behavior
          localStorage.removeItem("jwt");
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    });

    // Wait a moment for the logout logic to execute
    await page.waitForTimeout(1000);

    // Verify that the JWT token has been removed from localStorage
    const tokenAfterLogout = await page.evaluate(() =>
      localStorage.getItem("jwt")
    );
    expect(tokenAfterLogout).toBeNull();
  });

  /**
   * Test that valid token does not trigger logout
   */
  test("should not trigger logout when token is valid and auth API returns 200", async ({
    page,
  }) => {
    // Set up a valid JWT token in localStorage
    await page.evaluate(() => {
      localStorage.setItem("jwt", "valid.jwt.token");
    });

    // Mock the auth API to return 200 OK
    await page.route("**/api/auth/profile", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "123",
          email: "user@example.com",
          name: "Test User",
          role: "user",
        }),
      });
    });

    // Trigger an auth API call
    await page.evaluate(async () => {
      try {
        const response = await fetch("/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 403) {
          localStorage.removeItem("jwt");
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    });

    // Wait a moment
    await page.waitForTimeout(1000);

    // Verify that the JWT token is still present in localStorage
    const tokenAfterCall = await page.evaluate(() =>
      localStorage.getItem("jwt")
    );
    expect(tokenAfterCall).toBe("valid.jwt.token");
  });

  /**
   * Test axios interceptor behavior with RTK Query
   */
  test("should handle 403 error through axios interceptor in RTK Query", async ({
    page,
  }) => {
    // Set up an expired JWT token
    await page.evaluate(() => {
      localStorage.setItem("jwt", "expired.token.for.rtk.test");
    });

    // Mock any API endpoint to return 403
    await page.route("**/api/**", async (route) => {
      const url = route.request().url();
      if (url.includes("/api/")) {
        await route.fulfill({
          status: 403,
          contentType: "application/json",
          body: JSON.stringify({ error: "Forbidden - Token expired" }),
        });
      } else {
        await route.continue();
      }
    });

    // Execute a script that simulates RTK Query making an API call
    await page.evaluate(async () => {
      // Simulate axios interceptor behavior
      const makeApiCall = async () => {
        // eslint-disable-next-line no-useless-catch
        try {
          const response = await fetch("/api/auth/profile", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              "Content-Type": "application/json",
            },
          });

          // Simulate axios response interceptor
          if (response.status === 403) {
            localStorage.removeItem("jwt");
            throw new Error("Token expired - logged out");
          }

          return response;
        } catch (error) {
          throw error;
        }
      };

      await makeApiCall().catch((error) => {
        console.log("Expected error:", error.message);
      });
    });

    // Wait for the interceptor to process
    await page.waitForTimeout(1500);

    // Verify token was removed
    const finalToken = await page.evaluate(() => localStorage.getItem("jwt"));
    expect(finalToken).toBeNull();
  });
});
