
import { render, screen, fireEvent } from '@testing-library/react';
import SelectSlot from '@/app/Components/SelectBooking/SelectBooking';
import { TimeProvider } from '@/src/contexts/time.context/time.context';
import { vi } from 'vitest';

vi.mock('@/src/reducers/useTime', (): { useTime: () => Date; } => {
    return {
        useTime: () => new Date
    }
});

describe('Test of SelectSlot component', () => {
    test('should display 24 buttons for 24 slot in a day', () => {

        render(
            <TimeProvider>
                <SelectSlot />
            </TimeProvider>
        )

        let buttons = screen.getAllByRole('button');
        expect(buttons.length).toBe(24);
    });

    test('should display 23 buttons after selected one', () => {

        render(
            <TimeProvider>
                <SelectSlot />
            </TimeProvider>
        )

        let buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);

        let buttonsAfterClick = screen.getAllByRole('button');
        expect(buttonsAfterClick.length).toBe(buttons.length - 1);

    });
})