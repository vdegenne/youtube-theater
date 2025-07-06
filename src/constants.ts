/* vite only */
export const DEV = import.meta.env.DEV;

export const availablePages = ['main', 'video'] as const;
true as AllValuesPresent<Page, typeof availablePages>;
