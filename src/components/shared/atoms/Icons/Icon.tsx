import { cn } from "@/lib/utils";
import type { IconName } from "./iconList";
import { iconList } from "./iconList";

/**
 * Icon component that renders an icon using CSS mask to apply background color
 * @param name - The name of the icon from the iconList
 * @param width - The width of the icon in pixels (default: 24)
 * @param iconColorClass - The background color class for the icon (default: "bg-black")
 */
const Icon = ({
  name,
  width = 24,
  iconColorClass = "bg-black",
}: {
  name: IconName;
  width?: number;
  iconColorClass?: string;
}) => {
  return (
    <div 
      style={{ 
        width,
        height: width,
        maskImage: `url(${iconList[name]})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url(${iconList[name]})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }} 
      className={cn(iconColorClass)}
      role="img"
      aria-label={name}
    />
  );
};

export default Icon;
