import { Periods } from '@prisma/client';
import { create } from 'zustand';
import useServerData from '../../../../src/hooks/useServerData';

type PeriodStoreType = {
  periods: Periods[];
  initialisePeriods: (periods: Periods[]) => void;
  reLoadPeriods: (userId: string) => void;
  addPeriod: (period: Periods) => void;
  removePeriod: (period: Periods) => void;
};

const usePeriodsStore = create<PeriodStoreType>(set => ({
  periods: [],
  initialisePeriods: (periods) => set({ periods }),
  reLoadPeriods: async (createdById) => {
    const getPeriods = async () => {
      const periods = await useServerData('periods', { createdById })
      set(({ periods }));
    };
    getPeriods();
  },
  addPeriod: (period) => set(state => ({ periods: [...state.periods, period] })),
  removePeriod: (period) => set(state => ({ periods: state.periods.filter(s => s.id !== period.id) })),
}));

export default usePeriodsStore;