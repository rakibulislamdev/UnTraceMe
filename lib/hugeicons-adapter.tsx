import React from "react";
import { HugeiconsIcon, HugeiconsProps } from "@hugeicons/react";
import * as coreIcons from "@hugeicons/core-free-icons";

type IconComponent = React.FC<HugeiconsProps>;

function createIcon(iconData: any, displayName: string): IconComponent {
  const Comp: IconComponent = (props) => {
    return React.createElement(HugeiconsIcon, {
      icon: iconData,
      ...props,
    });
  };
  Comp.displayName = displayName;
  return Comp;
}

const proxy = new Proxy({} as Record<string, IconComponent>, {
  get: (target, prop: string) => {
    if (prop in target) return target[prop];
    const coreData = (coreIcons as any)[prop];
    if (coreData) {
      target[prop] = createIcon(coreData, prop);
      return target[prop];
    }
    // Fallback simple component if not found so React never crashes with "Element type is invalid"
    const Fallback: IconComponent = (props) => {
      return React.createElement("span", {
        className: props.className || "inline-block size-4",
      });
    };
    Fallback.displayName = prop;
    target[prop] = Fallback;
    return Fallback;
  },
});

export default proxy;

// Direct named exports for icons to guarantee bundler/Turbopack compatibility
export const AiVoiceIcon = proxy.AiVoiceIcon;
export const AlertCircleIcon = proxy.AlertCircleIcon;
export const AppleIcon = proxy.AppleIcon;
export const ArrowDown01Icon = proxy.ArrowDown01Icon;
export const ArrowLeft01Icon = proxy.ArrowLeft01Icon;
export const ArrowRight01Icon = proxy.ArrowRight01Icon;
export const BookOpen01Icon = proxy.BookOpen01Icon;
export const BubbleChatIcon = proxy.BubbleChatIcon;
export const Cancel01Icon = proxy.Cancel01Icon;
export const CheckmarkCircle02Icon = proxy.CheckmarkCircle02Icon;
export const CleanIcon = proxy.CleanIcon;
export const CodeCircleIcon = proxy.CodeCircleIcon;
export const ColorsIcon = proxy.ColorsIcon;
export const ComputerIcon = proxy.ComputerIcon;
export const Copy01Icon = proxy.Copy01Icon;
export const CpuIcon = proxy.CpuIcon;
export const CropIcon = proxy.CropIcon;
export const Delete02Icon = proxy.Delete02Icon;
export const Download04Icon = proxy.Download04Icon;
export const Drag01Icon = proxy.Drag01Icon;
export const Exchange01Icon = proxy.Exchange01Icon;
export const FileEditIcon = proxy.FileEditIcon;
export const FileExportIcon = proxy.FileExportIcon;
export const Folder01Icon = proxy.Folder01Icon;
export const Github01Icon = proxy.Github01Icon;
export const GlobeIcon = proxy.GlobeIcon;
export const HeartCheckIcon = proxy.HeartCheckIcon;
export const Image01Icon = proxy.Image01Icon;
export const ImageCompositionIcon = proxy.ImageCompositionIcon;
export const InformationCircleIcon = proxy.InformationCircleIcon;
export const Key01Icon = proxy.Key01Icon;
export const Layers01Icon = proxy.Layers01Icon;
export const Loading03Icon = proxy.Loading03Icon;
export const Maximize01Icon = proxy.Maximize01Icon;
export const Menu01Icon = proxy.Menu01Icon;
export const Moon01Icon = proxy.Moon01Icon;
export const MusicNote01Icon = proxy.MusicNote01Icon;
export const PaintBrush01Icon = proxy.PaintBrush01Icon;
export const ParagraphSpacingIcon = proxy.ParagraphSpacingIcon;
export const PauseIcon = proxy.PauseIcon;
export const Pdf01Icon = proxy.Pdf01Icon;
export const PlayIcon = proxy.PlayIcon;
export const RefreshIcon = proxy.RefreshIcon;
export const RotateRight01Icon = proxy.RotateRight01Icon;
export const SecurityLockIcon = proxy.SecurityLockIcon;
export const Settings01Icon = proxy.Settings01Icon;
export const Shield01Icon = proxy.Shield01Icon;
export const Shield02Icon = proxy.Shield02Icon;
export const SlidersHorizontalIcon = proxy.SlidersHorizontalIcon;
export const SmartPhone01Icon = proxy.SmartPhone01Icon;
export const SparklesIcon = proxy.SparklesIcon;
export const Sun01Icon = proxy.Sun01Icon;
export const Tag01Icon = proxy.Tag01Icon;
export const Upload01Icon = proxy.Upload01Icon;
export const Upload04Icon = proxy.Upload04Icon;
export const ViewIcon = proxy.ViewIcon;
export const VolumeHighIcon = proxy.VolumeHighIcon;
export const WaveIcon = proxy.WaveIcon;
