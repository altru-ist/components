export interface Config {
  locale: string;
  localize: {};
  CuiSchedule: {
    snapToClosestInterval: number;
    displayWeekNumbers: boolean;
    hourHeight: number;
    startHour: number;
    endHour: number;
    maxHeight: number | undefined;
    getFreeDropTimes: () => any[];
    type: string;
  };
}

let config: Config = {
  locale: "en-UK",
  localize: {},
  CuiSchedule: {
    snapToClosestInterval: 15, // Default value added
    displayWeekNumbers: true,
    hourHeight: 92,
    startHour: 0,
    endHour: 24,
    maxHeight: undefined,
    getFreeDropTimes: () => [],
    type: "day",
  },
};

export { config as default };

export const setOptions = (options: any) => {
  config = { ...config, ...options };
};
