import { createMedia } from '@artsy/fresnel';

const AppMedia = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 576,
    computer: 768,
  },
});

export const { Media, MediaContextProvider } = AppMedia;
