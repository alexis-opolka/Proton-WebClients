import type { History } from 'history';
import type { ServiceWorkerClient } from 'proton-pass-web/app/ServiceWorker/client/client';
import type { ClientContextValue } from 'proton-pass-web/src/app/Context/ClientProvider';

import type { PassConfig } from '@proton/pass/hooks/usePassConfig';
import { exposeApi } from '@proton/pass/lib/api/api';
import type { AuthService } from '@proton/pass/lib/auth/service';
import { authStore, createAuthStore, exposeAuthStore } from '@proton/pass/lib/auth/store';
import type { AppState } from '@proton/pass/types';
import createStore from '@proton/shared/lib/helpers/store';

import * as auth from './auth';

jest.mock('proton-pass-web/app/Store/store', () => ({ store: { dispatch: jest.fn() } }));
jest.mock('proton-pass-web/lib/telemetry', () => ({ telemetry: { stop: jest.fn() } }));
jest.mock('proton-pass-web/lib/settings', () => ({ settings: { clear: jest.fn() } }));

describe('AuthService', () => {
    let authService: AuthService;
    let appState: AppState;
    let history: History<any>;
    let sw: ServiceWorkerClient;
    let client: ClientContextValue;

    const config = { SSO_URL: 'test://' } as PassConfig;

    const getOfflineEnabled = jest.fn(async () => false);
    const getOnline = jest.fn(() => true);
    const onNotification = jest.fn();
    const setStatus = jest.fn();
    const setLoggedIn = jest.fn();
    const setBooted = jest.fn();
    const subscribe = jest.fn();

    exposeAuthStore(createAuthStore(createStore()));
    exposeApi({ subscribe } as any);

    jest.spyOn(auth, 'getDefaultLocalID').mockImplementation(() => undefined);
    jest.spyOn(auth, 'getPersistedSessionsForUserID').mockImplementation(() => []);

    beforeEach(() => {
        authStore.clear();
        client = { setStatus, setLoggedIn, setBooted, state: appState };
        history = { replace: jest.fn(), location: { pathname: '/', search: '', state: null, hash: '' } } as any;
        sw = { on: jest.fn(), off: jest.fn() } as any;
        authService = auth.createAuthService({
            config,
            sw,
            history,
            getClient: () => client,
            getOnline,
            getOfflineEnabled,
            onNotification,
        });
    });

    describe('init', () => {
        test('should not request fork if no sessions and no localID provided', async () => {
            const resumeSession = jest.spyOn(authService, 'resumeSession').mockImplementation(async () => false);
            const requestFork = jest.spyOn(authService, 'requestFork').mockImplementation();
            const result = await authService.init({});

            expect(resumeSession).toHaveBeenCalled();
            expect(requestFork).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });

        test('should requestFork if no sessions exist when localID in pathname', async () => {
            const resumeSession = jest.spyOn(authService, 'resumeSession').mockImplementation(async () => false);
            const requestFork = jest.spyOn(authService, 'requestFork').mockImplementation();

            history.location.pathname = '/u/42';
            const result = await authService.init({});

            expect(resumeSession).toHaveBeenCalled();
            expect(requestFork).toHaveBeenCalled();
            expect(result).toBe(false);
        });

        test('should clear authentication store if localID mismatch', async () => {
            const clear = jest.spyOn(authStore, 'clear');
            const resumeSession = jest.spyOn(authService, 'resumeSession').mockImplementation(async () => false);
            const requestFork = jest.spyOn(authService, 'requestFork').mockImplementation();

            history.location.pathname = '/u/42';
            authStore.setLocalID(1337); // in-memory store
            const result = await authService.init({});

            expect(result).toBe(false);
            expect(authStore.clear).toHaveBeenCalled();
            expect(resumeSession).toHaveBeenCalled();
            expect(requestFork).toHaveBeenCalled();

            clear.mockRestore();
        });
    });
});
