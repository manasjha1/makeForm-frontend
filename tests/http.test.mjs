import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import axios from 'axios';
import { apiHandler, apiClient } from '../app/src/services/httpHandler.ts';
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
afterEach(() => { if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage); else delete globalThis.localStorage; });
function storage() { Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => 'saved-token' } }); }
function capture() { let config; apiClient.defaults.adapter = async c => { config = c; return { data: {}, status: 200, statusText: 'OK', headers: {}, config: c }; }; return () => config; }
test('public requests omit saved tokens and explicit credentials win', async () => {
 storage(); const get = capture();
 await apiHandler({ url: '/public', skipAuth: true }); assert.equal(get().headers.get('Authorization'), undefined);
 await apiHandler({ url: '/private', headers: { Authorization: 'Bearer explicit' } }); assert.equal(get().headers.get('Authorization'), 'Bearer explicit');
 await apiHandler({ url: '/private' }); assert.equal(get().headers.get('Authorization'), 'Bearer saved-token');
});
test('requests tolerate unavailable or restricted browser storage', async () => {
 delete globalThis.localStorage; const get = capture(); await apiHandler({ url: '/public' }); assert.equal(get().headers.get('Authorization'), undefined);
 Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Blocked'); } });
 await apiHandler({ url: '/public' }); assert.equal(get().headers.get('Authorization'), undefined);
});
test('requests time out by default and allow explicit overrides including zero', async () => {
 storage(); const get = capture(); await apiHandler({ url: '/slow' }); assert.equal(get().timeout, 30000);
 await apiHandler({ url: '/slow', timeout: 5000 }); assert.equal(get().timeout, 5000);
 await apiHandler({ url: '/slow', timeout: 0 }); assert.equal(get().timeout, 0);
});
