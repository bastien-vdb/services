import { useConnect } from '@/src/hooks/useConnect';
import { renderHook } from '@testing-library/react';
describe('useConnect hook', () => {
    it('useConnect hook', () => {
        const { result } = renderHook(() => {
            return useConnect();
        })
        expect(result.current).toBe(true);
        
    })
})