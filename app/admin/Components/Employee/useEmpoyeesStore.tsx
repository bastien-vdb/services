import { Employee } from "@prisma/client";
import { create } from "zustand";
import useServerData from "@/src/hooks/useServerData";
import actionCreateEmployee from "./action-createEmployee";
import actionDeleteEmployee from "./action-deleteEmployee";

type EmployeeStoreType = {
  employees: Employee[];
  employeeSelected: Employee | null;
  employeeAdminSideSelectedId: string | null;
  loadingEmployee: boolean;
  initialiseEmployees: (employees: Employee[]) => void;
  changeEmployeeSelected: (employee: Employee | null) => void;
  changeEmployeeAdminSideSelectedId: (employee: string | null) => void;
  getEmployees: (userId: string) => void;
  addEmployee: (employee: {
    name: string;
    firstname: string;
    email: string;
  }) => Promise<void>;
  removeEmployee: (employee: Employee) => void;
};

const useEmployeeStore = create<EmployeeStoreType>((set) => ({
  employees: [],
  employeeSelected: null,
  employeeAdminSideSelectedId: null,
  optionSelected: undefined,
  loadingEmployee: false,
  initialiseEmployees: (employees) => set({ employees }),
  changeEmployeeAdminSideSelectedId: (employeeId) =>
    set({ employeeAdminSideSelectedId: employeeId }),
  changeEmployeeSelected: (employee) => set({ employeeSelected: employee }),
  getEmployees: async (userId) => {
    const employees = await useServerData("employee", { createdById: userId });
    set({ employees });
  },
  addEmployee: async (employee) => {
    set({ loadingEmployee: true });
    await actionCreateEmployee({
      name: employee.name,
      firstname: employee.firstname,
      email: employee.email,
    }).then((employee) => {
      set((state) => ({ employees: [...state.employees, employee] }));
      set({ loadingEmployee: false });
    });
  },
  removeEmployee: async (employee) => {
    set({ loadingEmployee: true });
    await actionDeleteEmployee({ employee })
      .then((e) => {
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== e.id),
        }));
      })
      .finally(() => set({ loadingEmployee: false }));
  },
}));

export default useEmployeeStore;
