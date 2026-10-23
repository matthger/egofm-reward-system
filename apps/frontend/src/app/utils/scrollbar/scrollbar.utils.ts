/**
 * Adds padding to the body to compensate for the width of the scrollbar.
 */
export function compensateScrollbarShift(): void {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

/**
 * Removes the scrollbar compensation from the body.
 */
export function resetScrollbarCompensation(): void {
  document.body.style.paddingRight = '';
}
