import { renderHook, clearAll } from '../helpers/test/helper';
import { useExpiration } from './useExpiration';
import { Message } from '../models/message';

describe('useExpiration', () => {
    const seconds = 10;

    const setup = (argMessage: Message) =>
        renderHook((rerenderMessage: Message) => useExpiration(rerenderMessage || argMessage));

    afterEach(() => {
        jest.clearAllMocks();
        clearAll();
    });

    it('should return no expiration if no expiration time', () => {
        const hook = setup({ ExpirationTime: 0 } as Message);
        expect(hook.result.current[0]).toBe(false);
    });

    it('should return the expiration message if there is expiration time', () => {
        const ExpirationTime = new Date().getTime() / 1000 + seconds;
        const hook = setup({ ExpirationTime } as Message);
        expect(hook.result.current[0]).toBe(true);
        expect(hook.result.current[1]).toContain(seconds - 1);
    });

    it('should be able to react to new message', () => {
        const messageWithoutExpiration = { ExpirationTime: 0 } as Message;
        const ExpirationTime = new Date().getTime() / 1000 + seconds;
        const messageWithExpiration = { ExpirationTime } as Message;
        const hook = setup(messageWithoutExpiration);
        expect(hook.result.current[0]).toBe(false);
        hook.rerender(messageWithExpiration);
        expect(hook.result.current[0]).toBe(true);
        hook.rerender(messageWithoutExpiration);
        expect(hook.result.current[0]).toBe(false);
    });
});
