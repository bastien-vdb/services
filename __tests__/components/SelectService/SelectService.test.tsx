import { ServiceProvider } from '@/src/contexts/service.context';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectService from '@/app/Components/SelectService/SelectService';
import { vi } from 'vitest';
import { useService } from '@/src/hooks/useService';

vi.mock('@/src/hooks/useService', vi.fn(() => {
    const serviceList = [{
        id: 1,
        name: "testService",
        price: 10,
    }];

    const serviceDispatchSpy = vi.fn();

    const serviceSelected = serviceList[0].name;
    const serviceState = {
        serviceList,
        serviceSelected
    }

    return {
        useService: () => { return { serviceState: serviceState, serviceDispatch: serviceDispatchSpy } }
    }
}));

vi.spyOn(useService(), 'serviceDispatch');

describe('Test du composant SelectService', () => {
    it('Services should be displayed in list', () => {
        render(
            <ServiceProvider>
                <SelectService />
            </ServiceProvider>
        );

        const retrievePriceFirstService = 10;
        const tableCell = screen.getByText(retrievePriceFirstService);

        expect(tableCell).toBeDefined();
    })

    it('Button réserver should be displayed in list', () => {
        render(
            <ServiceProvider>
                <SelectService />
            </ServiceProvider>
        );

        const buttons = screen.getAllByRole('button');
        expect(buttons[0].textContent).toBe('Réserver')
    });

    it('The component is unmounted', () => {
        render(
            <ServiceProvider>
                <SelectService />
            </ServiceProvider>
        );

        const buttons = screen.getAllByText('Réserver');
        fireEvent.click(buttons[0]);

        const button2 = screen.getAllByText('Réserver'); //Component is now unmounted
        expect(button2).toBeDefined();
    })

    it('The component is unmounted', () => {
        render(
            <ServiceProvider>
                <SelectService />
            </ServiceProvider>
        );

        const { serviceDispatch } = useService();
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);

        const dataSet = {
            type: 'SELECT_SERVICE',
            payload: { serviceSelected: 'testService' }
        }

        expect(serviceDispatch).toHaveBeenCalledWith(dataSet)
    })


})