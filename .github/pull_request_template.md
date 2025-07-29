<!--
PR TITLE GUIDELINE
------------------
If you’re adding or updating a provider file, start the title with “provider/<slug>: ”,
e.g.  provider/debifi: add rehypothecation evidence
-->

## ✨ What’s new?

_Describe the change in one or two sentences.  Explain the “why”, not just the “what”._

---

## 📄 Context / Motivation

_Why does this matter?  Link to discussions, issues, or external sources if helpful._

---

## 🗂️ Type of change (pick one)

- [ ] 🆕 **New provider** – adding `providers/<slug>/data.json`
- [ ] 📝 **Update provider** – editing an existing provider file
- [ ] 📚 **Docs / README / meta**
- [ ] 🐛 **Fix** – bug fix, lint tweak, misc
- [ ] 🚀 **Other** (explain below)

---

## ✅ Checklist

> Please tick the boxes that apply.

- [ ] I ran **`npm run validate`** locally and it passed.
- [ ] I ran **`npm run build`** locally (**dist/** _not_ committed).
- [ ] Provider data follows `provider.schema.json` (all required fields present).
- [ ] Evidence objects include **`source_url`** and **`created_at`**.
- [ ] CI passes (you’ll see the green checkmarks below).

---

## 🔗 Evidence / Screenshots (optional)

_Paste links or drag-and-drop screenshots that support the change._

---

## 📢 Anything else?

_Optional: call out follow-up work, open questions, or things reviewers should double-check._
