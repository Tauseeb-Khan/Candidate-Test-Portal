# Scholars' Group of Institutions - Candidate Test Portal

A static website (no build step, no server needed). Open `index.html` in a browser.

## Folder structure

```
scholars-test-portal/
├── index.html        Page structure (header, hero, test cards, branches, footer, popup)
├── css/style.css     All styling, split into commented sections
├── js/script.js      Popup logic, Google Form links, small visual effects
└── images/logo.png   School logo
```

## How it works

1. The candidate clicks **Teaching** or **Non-Teaching**.
2. A popup opens with short instructions.
3. **Open test in new tab** opens the matching Google Form in a new browser tab.

## Common changes

| What to change | Where |
| --- | --- |
| Google Form links or test titles | `FORMS` at the top of `js/script.js` |
| Email / phone number | `index.html` (header link and footer) |
| Branch names | `<section class="branches">` in `index.html` |
| Colours | CSS variables inside `:root` in `css/style.css` |
| Logo | replace `images/logo.png` (keep the same file name) |

## Notes

- Each Google Form must allow responses from anyone with the link
  (turn off "Restrict to users in your organization" in the form settings).
- Fonts load from Google Fonts, so the first load needs internet.
- Animations switch off automatically for users who enabled "reduce motion" in their system.
