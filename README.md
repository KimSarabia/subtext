# Subtext - Gendered Language Scanning Tool - Chrome Extension

## 🛠️ MVP To-Do List

### 🔧 Basic Extension Setup

* [X] Create `manifest.json` with `"manifest_version": 3`, name, version, and description.
* [X] Add `content.js` as the content script for Wikipedia articles.
[ ] Create minimal `popup.html`. (We should add a popup).
* [ ] Add placeholder icon for the extension.
* [ ] Test initial setup: load as unpacked extension in Chrome Developer Mode.

### ⚙️ Manifest Configuration

* [ ] Register content script to match only English Wikipedia articles:
  `*://en.wikipedia.org/wiki/*`
* [ ] Ensure no extra permissions are requested.
* [ ] Declare `action` and `default_popup` if using popup (We should use popup)

### 📚 Flagged Terms Logic

* [ ] Create a small list of gendered terms (e.g., "chairman", "manpower").
* [ ] Write brief, tooltip-style explanations for each term per Wikipedia MOS.
* [ ] Store terms and explanations in a dictionary or JSON file.

### 🧠 Content Script Functionality

* [ ] Target Wikipedia’s `#mw-content-text` for scanning.
* [ ] Search text nodes for flagged terms (case-insensitive, whole-word only).
* [ ] Avoid triggering on substrings (e.g., skip "Manchester").
* [ ] Wrap flagged terms with `<span class="gender-flagged" title="...">term</span>`.

### 🎨 Highlight Styling

* [ ] Add minimal CSS for `.gender-flagged` (e.g., yellow background).
* [ ] Inject CSS via content script or include as separate file in manifest.

### 🔍 Safety & Sanity Checks

* [ ] Ensure span-wrapping doesn’t break Wikipedia page layout.
* [ ] Avoid altering HTML inside tags, links, or citations.
* [ ] Highlight all instances, not just the first match.

### ❌ No NLP, No Magic

* [ ] Do **not** integrate NLP libraries or infer context.
* [ ] Do **not** auto-correct or rewrite content.
* [ ] Do **not** attempt to parse grammar — pure string matching only.

### 🧪 Testing & Validation

* [ ] Test on real Wikipedia articles containing flagged terms.
* [ ] Confirm tooltips appear and pages load normally.
* [ ] Fix bugs like partial matches or HTML issues.

### 🎁 Polish for Demo

* [ ] Finalize icon and confirm all files referenced in `manifest.json` exist.
* [ ] Version: "0.1" for MVP demo.

### 📦 Optional UI Features

* [ ] (Optional) Add popup to list flagged terms using `chrome.tabs.sendMessage`.
* [ ] (Optional) Inject sidebar with count + terms if no popup is used.

### 📸 Demo Prep

* [ ] Load extension on demo machine in Developer Mode.
* [ ] Have test articles bookmarked or pre-loaded.
* [ ] Prepare screenshots or screencast showing before/after highlighting.

### 🧾 README / Demo Notes

* [ ] Clearly state this is a proof-of-concept for English Wikipedia only.
* [ ] Be upfront about false positives (e.g., quotes, official titles).
* [ ] Mention future version ideas (context-awareness, settings).
* [ ] [Wikipedia’s Manual of Style](https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style)

---
