const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: null,
  });

  const page = (await browser.pages())[0];
  await page.goto('http://localhost:3000/#/smart-assistant', { waitUntil: 'networkidle2' });

  // Seed the review payload into localStorage
  await page.evaluate(() => {
    const mockPayload = {
      inputText: "I want to know the details of road repair work carried out on Market Street in Chennai during 2024. Please provide the certified copy of the road repair estimate, work order, contractor details, and completion report.",
      department: "Highways Department",
      departments: [
        { name: "Highways Department", matchedKeywords: ["road", "repair", "highway", "contractor"], confidence: 92 },
        { name: "Chennai Corporation", matchedKeywords: ["road", "Chennai", "municipal"], confidence: 75 },
        { name: "Public Works Department", matchedKeywords: ["construction", "work order"], confidence: 45 }
      ],
      matchedKeywords: ["road", "repair", "highway", "contractor"],
      generatedDraft: "To,\nThe Public Information Officer,\nHighways Department,\nGovernment of Tamil Nadu.\n\nSubject: Request for information under Right to Information Act, 2005\n\nSir/Madam,\n\nI, the undersigned, request the following information under Section 6(1) of the RTI Act, 2005:\n\n1. Certified copy of the road repair estimate prepared for Market Street, Chennai during the financial year 2024.\n2. Copy of the work order issued for the said repair work, including the name and details of the contractor.\n3. Copy of the completion report and quality inspection certificate.\n4. Total expenditure incurred for the repair work with a breakup of costs.\n\nI am willing to pay the prescribed fee for obtaining this information.\n\nThanking you,\nRaja Kumar",
      score: 8,
      suggestions: ["Include the exact ward number or zone for faster processing", "Mention whether you need certified or plain copies"],
      detectedLocation: "Chennai, Tamil Nadu",
      locationSuggestion: "",
      verification: { emailVerified: true, mobileVerified: true },
      formData: {
        publicAuthority: "Highways Department",
        applicantName: "Raja Kumar",
        gender: "Male",
        addressLine1: "123, Anna Nagar",
        addressLine2: "Chennai",
        addressLine3: "",
        pincode: "600001",
        country: "India",
        state: "Tamil Nadu",
        district: "Chennai",
        taluk: "Egmore",
        village: "Anna Nagar",
        phoneNumber: "9876543210",
        mobileNumber: "9876543210",
        email: "rajarx006@gmail.com",
        educationalStatus: "Literate",
        isBpl: "No",
        inputText: "I want to know the details of road repair work carried out on Market Street in Chennai during 2024.",
        location: "Chennai, Egmore, Anna Nagar"
      }
    };
    localStorage.setItem('smart_rti_review_payload', JSON.stringify(mockPayload));
  });

  // Navigate to review-draft
  await page.goto('http://localhost:3000/#/review-draft', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const artifactDir = 'C:/Users/ELCOT/.gemini/antigravity-ide/brain/8b00f008-f514-4504-8a69-73ffc71054cc';

  // Screenshot 1: Top
  await page.screenshot({ path: `${artifactDir}/review_top.png`, fullPage: false });
  console.log('Screenshot 1 saved: review_top.png');

  // Scroll down and take screenshot 2
  await page.evaluate(() => window.scrollBy(0, 700));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${artifactDir}/review_middle.png`, fullPage: false });
  console.log('Screenshot 2 saved: review_middle.png');

  // Scroll down more and take screenshot 3
  await page.evaluate(() => window.scrollBy(0, 700));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${artifactDir}/review_bottom.png`, fullPage: false });
  console.log('Screenshot 3 saved: review_bottom.png');

  // Full page screenshot
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${artifactDir}/review_full.png`, fullPage: true });
  console.log('Screenshot 4 saved: review_full.png (full page)');

  console.log('All screenshots captured successfully!');
  await browser.disconnect();
})();
