import { createMedia } from '@artsy/fresnel';

const AppMedia = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 1, // 576,
    computer: 2, // 768,
  },
});

export const { Media, MediaContextProvider } = AppMedia;
