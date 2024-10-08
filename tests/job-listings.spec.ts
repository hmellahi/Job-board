import { categories, jobsPerPage } from "@/constants/jobs";
import { expect, test, type Page } from "@playwright/test";

const testCategory = categories[0];

test.describe("Job Listings E2E Tests", () => {
  let page: Page;

  const chooseACategory = async () => {
    await page.click("text=All Categories");
    // Make the selection more specific by using nth-of-type or checking attributes
    await page.click(`role=option >> text=${testCategory}`);
  };

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto("http://localhost:5173"); // Adjust URL as needed
  });

  test("should handle fetch error state", async () => {
    // Intercept the network request and simulate a failed response
    await page.route("**/v1/jobs/**", (route) => {
      route.fulfill({
        status: 500, // Simulate a server error
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    // Reload the page to trigger the failed request
    await page.reload();

    // Check that the error state is displayed (assuming the app shows an error message)
    await expect(page.locator("text=Error fetching jobs")).toBeVisible({
      timeout: 10000,
    }); // 10 seconds
  });

  test("should load and display job listings", async () => {
    await expect(page.locator(".job-card")).toHaveCount(jobsPerPage);
  });

  test("should search for jobs by name", async () => {
    await page.fill('input[placeholder="Search jobs..."]', "Developer");
    await expect(page.locator(".job-card")).toContainText("Developer");
  });

  test("Should filter jobs by category", async () => {
    await chooseACategory();

    // Get all job cards
    const jobCards = page.locator(".job-card");

    // Check that each job card contains the selected category
    const count = await jobCards.count();

    // 2 is the number of job cards with the selected category
    // normally the count should be fetched from the API and not hardcoded
    expect(count).toBe(2);

    for (let i = 0; i < count; i++) {
      await expect(jobCards.nth(i)).toContainText(testCategory);
    }
  });

  test("should sort jobs by name", async () => {
    // Click the sort dropdown and select "Name"
    await page.click("text=Sort by");
    await page.click("role=option >> text=Name");

    // Wait for the sorting to take effect
    await page.waitForTimeout(500);

    // Get all job cards
    const jobCards = await page.locator(".job-card").all();

    // Extract names from the job cards
    const names = await Promise.all(
      jobCards.map(async (card) => {
        return await card.locator(".job-title").textContent();
      })
    );

    // Create a copy of names and sort it alphabetically
    const sortedNames = [...names].sort((a, b) => a!.localeCompare(b!));

    // Check if names are in alphabetical order
    expect(names).toEqual(sortedNames);

    // Optional: Check if the "Name" option is visually selected in the dropdown
    const sortDropdown = await page.locator("text=Name");
    await expect(sortDropdown).toBeVisible();

    // Additional check: Verify that the first and last names are in correct positions
    const firstJobTitle = await jobCards[0].locator(".job-title").textContent();
    const lastJobTitle = await jobCards[jobCards.length - 1]
      .locator(".job-title")
      .textContent();
    expect(firstJobTitle).toBe(sortedNames[0]);
    expect(lastJobTitle).toBe(sortedNames[sortedNames.length - 1]);
  });

  test("should sort jobs by date", async () => {
    // Click the sort dropdown and select "Date"
    await page.click("text=Sort by");
    await page.click("role=option >> text=Date");

    // Wait for the sorting to take effect
    await page.waitForTimeout(500);

    // Get all job cards
    const jobCards = await page.locator(".job-card").all();

    // Extract dates from the job cards
    const dates = await Promise.all(
      jobCards.map(async (card) => {
        const dateText = await card.locator(".job-card-date").textContent();
        return new Date(dateText!);
      })
    );

    // Create a copy of dates and sort it in descending order (most recent first)
    const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());

    // Check if dates are in descending order
    expect(dates).toEqual(sortedDates);

    // Optional: Check if the "Date" option is visually selected in the dropdown
    const sortDropdown = await page.locator("text=Date");
    await expect(sortDropdown).toBeVisible();
  });

  test("should sort jobs by category", async () => {
    // Click the sort dropdown and select "Category"
    await page.click("text=Sort by");
    await page.click("role=option >> text=Category");

    // Wait for the sorting to take effect
    await page.waitForTimeout(500);

    // Get all job cards
    const jobCards = await page.locator(".job-card").all();

    // Extract categories from the job cards
    const categories = await Promise.all(
      jobCards.map(async (card) => {
        const categoryElement = card.locator(".job-card-category");
        // Check if the category element exists (i.e., count is greater than 0)
        const hasCategory = (await categoryElement.count()) > 0;

        // If it exists, return the category text in lowercase; otherwise, return an empty string
        if (!hasCategory) {
          return "";
        }

        let categoryContent = await categoryElement.textContent();

        return categoryContent?.toLowerCase();
      })
    );

    // Create a copy of categories and sort it alphabetically
    const sortedCategories = [...categories].sort((a, b) => a.localeCompare(b));

    // Check if categories are in alphabetical order
    expect(categories).toEqual(sortedCategories);

    // Optional: Check if the "Category" option is visually selected in the dropdown
    const sortDropdown = await page.locator("text=Category");
    await expect(sortDropdown).toBeVisible();
  });

  test("should allow reordering of jobs by drag and drop", async () => {
    // Get the first two job cards
    const firstJob = page.locator(".job-card").first();
    const secondJob = page.locator(".job-card").nth(1);

    // Get the text content of the job titles before dragging
    const firstJobTitle = await firstJob.locator(".job-title").textContent();
    const secondJobTitle = await secondJob.locator(".job-title").textContent();

    // Get the bounding boxes of the job cards
    const firstJobBox = await firstJob.boundingBox();
    const secondJobBox = await secondJob.boundingBox();

    if (!firstJobBox || !secondJobBox) {
      throw new Error("Unable to get bounding boxes for job cards");
    }

    // Calculate the center points of the job cards
    const firstJobCenter = {
      x: firstJobBox.x + firstJobBox.width / 2,
      y: firstJobBox.y + firstJobBox.height / 2,
    };
    const secondJobCenter = {
      x: secondJobBox.x + secondJobBox.width / 2,
      y: secondJobBox.y + secondJobBox.height / 2,
    };

    // Perform the drag and drop operation
    await page.mouse.move(firstJobCenter.x, firstJobCenter.y);
    await page.mouse.down();
    await page.mouse.move(secondJobCenter.x, secondJobCenter.y, { steps: 20 });
    await page.mouse.up();

    // Wait for the job cards to reorder
    await page.waitForFunction(
      ([firstJobTitle, secondJobTitle]) => {
        const jobCards = Array.from(
          document.querySelectorAll(".job-card .job-title")
        );
        const firstJob = jobCards[0];
        const secondJob = jobCards[1];
        return (
          firstJob?.textContent !== firstJobTitle &&
          secondJob?.textContent !== secondJobTitle
        );
      },
      [firstJobTitle, secondJobTitle], // Pass arguments as an array
      { timeout: 10000 } // Optional timeout
    );

    // Get the new first two job cards after dragging
    const newFirstJob = page.locator(".job-card").first();
    const newSecondJob = page.locator(".job-card").nth(1);

    // Get the text content of the job titles after dragging
    const newFirstJobTitle = await newFirstJob
      .locator(".job-title")
      .textContent();
    const newSecondJobTitle = await newSecondJob
      .locator(".job-title")
      .textContent();

    // Assert that the order has changed
    expect(newFirstJobTitle).toBe(secondJobTitle);
    expect(newSecondJobTitle).toBe(firstJobTitle);
  });

  test("should save filters to localStorage", async () => {
    await page.fill('input[placeholder="Search jobs..."]', "Manager");
    await chooseACategory();

    await page.reload();

    await expect(
      page.locator('input[placeholder="Search jobs..."]')
    ).toHaveValue("Manager");
    await expect(page.locator(`text=${testCategory}`)).toBeVisible();
  });

  test("should handle empty state", async () => {
    await page.fill('input[placeholder="Search jobs..."]', "NonexistentJob");
    await expect(page.locator("text=No jobs found")).toBeVisible();
  });

  test("should handle loading state", async () => {
    await page.reload();
    await expect(page.locator("text=Loading...")).toBeVisible();
  });

  test("should implement pagination", async () => {
    // make it dynamic, in this case we only have 15 jobs...
    await expect(page.locator(".pagination")).toBeVisible();
    await page.click("text=Next");
    await expect(page.locator("text=Page 2 of")).toBeVisible();
    await expect(page.locator("text=Next")).toBeDisabled();
    await page.click("text=Previous");
    await expect(page.locator("text=Page 1 of")).toBeVisible();
    await expect(page.locator("text=Previous")).toBeDisabled();
  });

  test("should expand job card to show details", async () => {
    await page.click(".job-card >> [aria-label='Expand job details']");
    await expect(page.locator(".job-card-details")).toBeVisible();
  });

  test("Reset all filters should be disabled by default", async () => {
    await expect(page.locator("text=Reset Filters")).toBeDisabled();
    await chooseACategory();
    await page.reload();

    await page.click("text=Reset Filters");
    await expect(page.locator("text=All Categories")).toBeVisible();
  });

  test("should reset all filters", async () => {
    await page.fill('input[placeholder="Search jobs..."]', "Developer");
    await chooseACategory();
    await page.click("text=Reset Filters");

    await expect(
      page.locator('input[placeholder="Search jobs..."]')
    ).toHaveValue("");
    await expect(page.locator("text=All Categories")).toBeVisible();
  });

  test("should be responsive", async ({}, testInfo) => {
    if (testInfo.project.name.startsWith("Mobile")) {
      return;
    }

    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator(".job-listings")).toBeVisible();

    // Test on tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator(".job-listings")).toBeVisible();
  });
});
