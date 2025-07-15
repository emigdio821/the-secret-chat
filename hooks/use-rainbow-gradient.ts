export function useRainbowGradient() {
  const bg = `bg-[linear-gradient(180deg,hsl(var(--background)/0.5),hsl(var(--background)/0.5)_85%),radial-gradient(ellipse_at_top_left,rgba(13,110,253,0.2),transparent_50%),radial-gradient(ellipse_at_top_right,rgba(255,228,132,0.2),transparent_50%),radial-gradient(ellipse_at_center_right,rgba(112,44,249,0.2),transparent_50%),radial-gradient(ellipse_at_center_left,rgba(214,51,132,0.2),transparent_50%)]`
  return bg
}
