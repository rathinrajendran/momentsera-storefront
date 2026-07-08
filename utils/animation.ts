export function getAnimationKey(motion: any) {
  return JSON.stringify({
    style: motion?.animation_style,
    speed: motion?.animation_speed,
    enabled: motion?.animations,
    entry: motion?.animation_entry,
    behavior: motion?.scroll_behavior,
    duration: motion?.animation_duration,
    delay: motion?.animation_delay,
  });
}