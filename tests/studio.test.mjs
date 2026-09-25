import { registerHooks } from "node:module";
import { test } from "node:test";
import assert from "node:assert/strict";
registerHooks({ resolve(specifier, context, nextResolve) {
    return nextResolve(specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier) ? `${specifier}.ts` : specifier, context);
} });
const { studioForm } = await import("../app/src/data/studio-form.ts");
const { moveField, removeField, duplicateField, visibleFields, normalizeConditions, initialAnswers } = await import("../app/src/lib/studio-model.ts");
const { validateAnswers } = await import("../app/src/lib/form-validation.ts");
const { saveDraft, readDraft } = await import("../app/src/lib/form-draft.ts");
const { dropTargetIndex } = await import("../app/src/lib/studio-model.ts");
const { nextOptionLabel, renameOption } = await import("../app/src/lib/field-options.ts");
const field = (id, extra = {}) => ({ id, type: "text", label: id, required: false, ...extra });

test("numeric step validation handles decimals and a minimum offset", () => {
    const number = field("n", { type: "number", min: 0.1, step: 0.2 });
    assert.deepEqual(validateAnswers([number], { n: "0.3" }), {});
    assert.ok(validateAnswers([number], { n: "0.2" }).n);
    assert.deepEqual(validateAnswers([field("n", { type: "number" })], { n: "0.123" }), {});
});
test("hide conditions invert matches while hidden parents suppress children", () => {
    const fields = [field("a"), field("b", { condition: { fieldId: "a", operator: "equals", value: "yes", action: "hide" } }), field("c", { condition: { fieldId: "b", operator: "notEmpty", value: "" } })];
    assert.deepEqual(visibleFields(fields, { a: "yes", b: "stale" }).map((item) => item.id), ["a"]);
    assert.deepEqual(visibleFields(fields, { a: "no", b: "answer" }).map((item) => item.id), ["a", "b", "c"]);
});
test("agreement defaults affect only single checkboxes", () => {
    assert.deepEqual(initialAnswers([field("single", { type: "checkbox", defaultValue: "true" }), field("group", { type: "checkbox", defaultValue: "true", options: ["One"] })]), { single: true, group: [] });
});
test("new rule settings survive draft persistence and reject invalid steps", () => {
    const values = new Map();
    globalThis.sessionStorage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
    const form = { ...studioForm, fields: [field("a", { type: "number", step: 0.01 }), field("b", { condition: { fieldId: "a", operator: "notEmpty", value: "", action: "hide" } })] };
    saveDraft(form);
    assert.deepEqual(readDraft(), form);
    form.fields[0].step = -1;
    saveDraft(form);
    assert.equal(readDraft(), null);
    delete globalThis.sessionStorage;
});
test("blank starter remains isolated when adding questions", async () => {
    const { blankForm } = await import("../app/src/data/studio-form.ts");
    const draft = structuredClone(blankForm);
    draft.fields.push(field("custom"));
    assert.equal(blankForm.fields.length, 0);
    assert.equal(draft.fields.length, 1);
});

test("drop slots place fields before the marker in either direction", () => {
    const fields = [field("a"), field("b"), field("c"), field("d")];
    const form = { ...studioForm, fields };
    assert.deepEqual(moveField(form, "a", dropTargetIndex(fields, "a", 2)).fields.map((item) => item.id), ["b", "a", "c", "d"]);
    assert.deepEqual(moveField(form, "d", dropTargetIndex(fields, "d", 1)).fields.map((item) => item.id), ["a", "d", "b", "c"]);
    assert.equal(dropTargetIndex(fields, "a", 4), 3);
    assert.equal(dropTargetIndex(fields, "b", 2), 1);
});
test("choice renaming preserves defaults without mutating the field", () => {
    const source = field("choice", { type: "select", options: ["One", "Two"], defaultValue: "Two" });
    assert.deepEqual(renameOption(source, 1, "Second"), { options: ["One", "Second"], defaultValue: "Second" });
    assert.deepEqual(renameOption(source, 0, "First"), { options: ["First", "Two"] });
    assert.equal(source.defaultValue, "Two");
    assert.deepEqual(source.options, ["One", "Two"]);
});
test("new option labels remain unique after deletion and reordering", () => {
    assert.equal(nextOptionLabel([]), "Option 1");
    assert.equal(nextOptionLabel(["Option 3", "Option 1"]), "Option 2");
    assert.equal(nextOptionLabel(["Option 1", "Option 2", "Option 3"]), "Option 4");
});

test("studio starter contains all nine reference field types", () => {
    assert.equal(studioForm.fields.length, 9);
    assert.equal(new Set(studioForm.fields.map((item) => item.type)).size, 9);
    assert.equal(new Set(studioForm.fields.map((item) => item.id)).size, 9);
});
test("reorder and duplicate preserve source and isolate options", () => {
    const snapshot = structuredClone(studioForm);
    const moved = moveField(studioForm, "field-1", 8);
    assert.equal(moved.fields[8].id, "field-1");
    assert.deepEqual(studioForm, snapshot);
    assert.equal(moveField(studioForm, "missing", 1), studioForm);
    assert.equal(moveField(studioForm, "field-1", -1), studioForm);
    const copy = duplicateField(studioForm.fields[2]);
    copy.options.push("New choice");
    assert.notEqual(copy.id, "field-3");
    assert.equal(studioForm.fields[2].options.length, 4);
});
test("deletion and reordering clear dangling or forward conditions", () => {
    const form = { ...studioForm, fields: [field("a"), field("b", { condition: { fieldId: "a", operator: "equals", value: "yes" } })] };
    assert.equal(removeField(form, "a").fields[0].condition, undefined);
    assert.equal(normalizeConditions(moveField(form, "b", 0)).fields[0].condition, undefined);
    assert.ok(form.fields[1].condition);
});
test("conditional chains hide descendants even when stale answers remain", () => {
    const fields = [field("a"), field("b", { condition: { fieldId: "a", operator: "equals", value: "yes" } }), field("c", { required: true, condition: { fieldId: "b", operator: "notEmpty", value: "" } })];
    assert.deepEqual(visibleFields(fields, { a: "no", b: "old" }).map((item) => item.id), ["a"]);
    assert.deepEqual(visibleFields(fields, { a: "yes", b: "present" }).map((item) => item.id), ["a", "b", "c"]);
    assert.deepEqual(validateAnswers(visibleFields(fields, { a: "no" }), { a: "no" }), {});
});
test("choice and boolean conditions handle contains and notEquals", () => {
    const fields = [field("a", { type: "checkbox" }), field("b", { condition: { fieldId: "a", operator: "contains", value: "plan" } })];
    assert.equal(visibleFields(fields, { a: ["plan A"] }).length, 2);
    fields[1].condition = { fieldId: "a", operator: "notEquals", value: "false" };
    assert.equal(visibleFields(fields, { a: false }).length, 1);
    assert.equal(visibleFields(fields, { a: true }).length, 2);
});
test("preview validates required, email, numeric, text and choice constraints", () => {
    const fields = [field("name", { required: true, minLength: 3 }), field("email", { type: "email" }), field("number", { type: "number", min: 10, max: 20 }), field("choice", { type: "select", options: ["One"] }), field("agreement", { type: "checkbox", required: true })];
    assert.equal(Object.keys(validateAnswers(fields, { name: "ab", email: "bad", number: "9", choice: "Two", agreement: false })).length, 5);
    assert.deepEqual(validateAnswers(fields, { name: "Ada", email: "ada@example.com", number: "15", choice: "One", agreement: true }), {});
    assert.ok(validateAnswers([field("zero", { type: "number", required: true, min: 0 })], { zero: "0" }).zero === undefined);
});
test("upload restrictions and custom errors are enforced without uploading", () => {
    const fields = [field("upload", { type: "file", required: true, accept: ".pdf", maxFileSize: 1, errorMessage: "Use a small PDF" })];
    assert.equal(validateAnswers(fields, {}, {}).upload, "Use a small PDF");
    assert.equal(validateAnswers(fields, {}, { upload: { name: "bad.exe", size: 10, type: "application/octet-stream" } }).upload, "Use a small PDF");
    assert.equal(validateAnswers(fields, {}, { upload: { name: "large.pdf", size: 2000000, type: "application/pdf" } }).upload, "Use a small PDF");
    assert.deepEqual(validateAnswers(fields, {}, { upload: { name: "ok.PDF", size: 100, type: "application/pdf" } }), {});
});
test("studio drafts round-trip every new setting", () => {
    const values = new Map();
    globalThis.sessionStorage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
    const form = structuredClone(studioForm);
    Object.assign(form.fields[1], { defaultValue: "test@example.com", minLength: 4, maxLength: 80, errorMessage: "Enter work email", condition: { fieldId: "field-1", operator: "notEmpty", value: "" } });
    assert.equal(saveDraft(form), true);
    assert.deepEqual(readDraft(), form);
    assert.equal(initialAnswers(form.fields)["field-2"], "test@example.com");
    assert.deepEqual(initialAnswers(form.fields)["field-9"], []);
    delete globalThis.sessionStorage;
});

 test("draft recovery rejects duplicate IDs and repairs broken dependencies", () => {
    let saved;
    globalThis.sessionStorage = { getItem: () => saved, setItem: (_, value) => { saved = value; } };
    saveDraft({ ...studioForm, fields: [field("same"), field("same")] });
    assert.equal(readDraft(), null);
    saveDraft({ ...studioForm, fields: [field("a", { condition: { fieldId: "missing", operator: "equals", value: "yes" } })] });
    assert.equal(readDraft().fields[0].condition, undefined);
    delete globalThis.sessionStorage;
});

test("date validation rejects impossible dates and accepts leap days", () => {
    const date = field("date", { type: "date" });
    for (const value of ["2025-02-29", "2026-04-31", "not-a-date", "2026-13-01"]) assert.ok(validateAnswers([date], { date: value }).date);
    assert.deepEqual(validateAnswers([date], { date: "2024-02-29" }), {});
    assert.deepEqual(validateAnswers([date], { date: "" }), {});
});
