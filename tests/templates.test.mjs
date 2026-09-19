import { registerHooks } from "node:module";
import { test } from "node:test";
import assert from "node:assert/strict";

// Node 24 strips TypeScript; resolve the extensionless imports used by Vite.
registerHooks({ resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
        return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
} });
const { formTemplates, findTemplate } = await import("../app/src/data/form-templates.ts");
const { createForm } = await import("../app/src/lib/form-types.ts");
const { readDraft, saveDraft } = await import("../app/src/lib/form-draft.ts");

test("catalog has unique templates and valid field definitions", () => {
    assert.equal(formTemplates.length, 6);
    assert.equal(new Set(formTemplates.map((item) => item.id)).size, 6);
    for (const form of formTemplates) {
        assert.ok(form.title && form.description && form.fields.length);
        assert.equal(new Set(form.fields.map((field) => field.id)).size, form.fields.length);
        for (const field of form.fields) {
            assert.ok(field.label);
            if (field.type === "select") assert.ok(field.options.length > 0 && field.options.every(Boolean));
            if (field.min !== undefined && field.max !== undefined) assert.ok(field.min <= field.max);
        }
    }
    assert.equal(findTemplate("missing"), undefined);
});

test("editing a form cannot mutate catalog fields or option arrays", () => {
    const source = findTemplate("contact");
    const copy = createForm(source);
    copy.fields[0].label = "Changed";
    copy.fields[2].options.push("Extra");
    assert.equal(source.fields[0].label, "Full name");
    assert.equal(source.fields[2].options.length, 3);
});

test("draft round trip preserves custom labels, options and numeric bounds", () => {
    const values = new Map();
    globalThis.sessionStorage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
    assert.equal(readDraft(), null);
    const form = createForm(findTemplate("event-registration"));
    form.title = "Team meetup";
    assert.equal(saveDraft(form), true);
    assert.deepEqual(readDraft(), form);
    for (const invalid of ["broken json", "null", '{"fields":[]}', JSON.stringify({ ...form, fields: [{ type: "script" }] })]) {
        values.set("makeform-template-draft-v1", invalid);
        assert.equal(readDraft(), null);
    }
});

test("unavailable browser storage fails gracefully", () => {
    globalThis.sessionStorage = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("quota"); } };
    assert.equal(readDraft(), null);
    assert.equal(saveDraft(formTemplates[0]), false);
    delete globalThis.sessionStorage;
    assert.equal(readDraft(), null);
});
