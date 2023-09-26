import { TimeProvider } from '@/src/contexts/time.context';
import { useTime } from '@/src/hooks/useTime';
import { act, render, renderHook } from '@testing-library/react';
import { setHours } from 'date-fns';
import { ReactNode } from 'react';
describe('hook useTime', () => {

    const wrapper = ({ children }: { children: ReactNode }) => <TimeProvider>{children}</TimeProvider>
    const { result } = renderHook(() => useTime(), { wrapper });

    it('change the day selected', () => {

        expect(result.current.daySelected).toBe(null);

        const newDate = new Date(new Date().setHours(0));

        act(() => result.current.setDaySelected(newDate));
        expect(result.current.daySelected).not.toBe(null);
    })
})