export function useRainbowGradient() {
  const bg = `linear-gradient(180deg, hsl(var(--background)/0.5), hsl(var(--background)/0.5) 85%),radial-gradient(ellipse at top left, rgba(13, 110, 253, 0.2), transparent 50%),radial-gradient(ellipse at top right, rgba(255, 228, 132, 0.2), transparent 50%),radial-gradient(ellipse at center right, rgba(112, 44, 249, 0.2), transparent 50%),radial-gradient(ellipse at center left, rgba(214, 51, 132, 0.2), transparent 50%)`

  return bg
}
