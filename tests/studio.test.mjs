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
const field = (id, extra = {}) => ({ id, type: "text", label: id, required: false, ...extra });

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
