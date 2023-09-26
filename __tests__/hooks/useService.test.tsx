import { act, renderHook } from "@testing-library/react";
import { useService } from "@/src/hooks/useService";
import { ServiceProvider } from "@/src/contexts/service.context";
describe('hook useService', () => {
    it('should add a Service', () => {
        const { result } = renderHook(() => useService(), { wrapper: ({ children }) => <ServiceProvider>{children}</ServiceProvider> });

        const serviceListLength = result.current.serviceState.serviceList.length;

        act(() => {
            result.current.serviceDispatch({
                type: "ADD_SERVICE",
                payload: {
                    newService: {
                        name: "test",
                        price: 10
                    }
                }
            })
        })

        expect(result.current.serviceState.serviceList.length).toBe(serviceListLength + 1);
    });

    it('should delete a Service', () => {
        const { result } = renderHook(() => useService(), { wrapper: ({ children }) => <ServiceProvider>{children}</ServiceProvider> });

        const serviceListLength = result.current.serviceState.serviceList.length;

        act(() => {
            result.current.serviceDispatch({
                type: "DELETE_SERVICE",
                payload: {
                    serviceSelected: 'Cils Asiatique'
                }
            })
        })

        expect(result.current.serviceState.serviceList.length).toBe(serviceListLength - 1);
    });

    it('should select a Service', () => {
        const { result } = renderHook(() => useService(), { wrapper: ({ children }) => <ServiceProvider>{children}</ServiceProvider> });

        const serviceListLength = result.current.serviceState.serviceList.length;

        act(() => {
            result.current.serviceDispatch({
                type: "SELECT_SERVICE",
                payload: {
                    serviceSelected: 'Cils Asiatique'
                }
            })
        })

        expect(result.current.serviceState.serviceSelected).toBe('Cils Asiatique');
    });

    it('should reset aervice', () => {
        const { result } = renderHook(() => useService(), { wrapper: ({ children }) => <ServiceProvider>{children}</ServiceProvider> });

        const serviceListLength = result.current.serviceState.serviceList.length;

        act(() => {
            result.current.serviceDispatch({
                type: "SELECT_SERVICE",
                payload: {
                    serviceSelected: 'Cils Asiatique'
                }
            });

            result.current.serviceDispatch({
                type: "RESET"
            })
        })

        expect(result.current.serviceState.serviceSelected).toBe('');
    });
}
);