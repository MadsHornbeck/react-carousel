# API

## `Carousel`

### Parameters

- children
- className - allows for adding class to the base carousel div. Adding side-padding allows for a peek at the previous / next slides.
- free (default: false) - if true the slides will not snap to fit.
- itemsPerSlide (default: 1) - how many items should be shown per slide. One slides is what is shown at any one time.
- revolve (default: false) - Whether or not the carousel should wrap around when the end is reached.
- gap (default: "") - the gap between items. NB only use absolute distance units (px, rem, etc.) as relative units might make the slides not align correctly.
- center (default: false) - center the active slide

### ref

Adding a ref to the `Carousel` component will expose the following data and functions:

- next - () -> void - go to the next item
- prev - () -> void - go to the previous item
- changePosition - delta -> void - goes delta distance, pass negative value to go backwards
- setPosition - index -> void - set `index` to the current item
- index - Number - the current items index
