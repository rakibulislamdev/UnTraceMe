declare module "hugeicons-react" {
  import * as React from "react";

  export interface HugeiconsProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    className?: string;
  }

  export type HugeiconComponent = React.FC<HugeiconsProps>;

  export const AiVoiceIcon: HugeiconComponent;
  export const AlertCircleIcon: HugeiconComponent;
  export const AppleIcon: HugeiconComponent;
  export const ArrowDown01Icon: HugeiconComponent;
  export const ArrowLeft01Icon: HugeiconComponent;
  export const ArrowRight01Icon: HugeiconComponent;
  export const BookOpen01Icon: HugeiconComponent;
  export const BubbleChatIcon: HugeiconComponent;
  export const Cancel01Icon: HugeiconComponent;
  export const CheckmarkCircle02Icon: HugeiconComponent;
  export const CleanIcon: HugeiconComponent;
  export const CodeCircleIcon: HugeiconComponent;
  export const ColorsIcon: HugeiconComponent;
  export const ComputerIcon: HugeiconComponent;
  export const Copy01Icon: HugeiconComponent;
  export const CpuIcon: HugeiconComponent;
  export const CropIcon: HugeiconComponent;
  export const Delete02Icon: HugeiconComponent;
  export const Download04Icon: HugeiconComponent;
  export const Drag01Icon: HugeiconComponent;
  export const Exchange01Icon: HugeiconComponent;
  export const FileEditIcon: HugeiconComponent;
  export const FileExportIcon: HugeiconComponent;
  export const Folder01Icon: HugeiconComponent;
  export const Github01Icon: HugeiconComponent;
  export const GlobeIcon: HugeiconComponent;
  export const HeartCheckIcon: HugeiconComponent;
  export const Image01Icon: HugeiconComponent;
  export const ImageCompositionIcon: HugeiconComponent;
  export const InformationCircleIcon: HugeiconComponent;
  export const Key01Icon: HugeiconComponent;
  export const Layers01Icon: HugeiconComponent;
  export const Loading03Icon: HugeiconComponent;
  export const Maximize01Icon: HugeiconComponent;
  export const Menu01Icon: HugeiconComponent;
  export const Moon01Icon: HugeiconComponent;
  export const MusicNote01Icon: HugeiconComponent;
  export const PaintBrush01Icon: HugeiconComponent;
  export const ParagraphSpacingIcon: HugeiconComponent;
  export const PauseIcon: HugeiconComponent;
  export const Pdf01Icon: HugeiconComponent;
  export const PlayIcon: HugeiconComponent;
  export const RefreshIcon: HugeiconComponent;
  export const RotateRight01Icon: HugeiconComponent;
  export const SecurityLockIcon: HugeiconComponent;
  export const Settings01Icon: HugeiconComponent;
  export const Shield01Icon: HugeiconComponent;
  export const Shield02Icon: HugeiconComponent;
  export const SlidersHorizontalIcon: HugeiconComponent;
  export const SmartPhone01Icon: HugeiconComponent;
  export const SparklesIcon: HugeiconComponent;
  export const Sun01Icon: HugeiconComponent;
  export const Tag01Icon: HugeiconComponent;
  export const Upload01Icon: HugeiconComponent;
  export const Upload04Icon: HugeiconComponent;
  export const ViewIcon: HugeiconComponent;
  export const VolumeHighIcon: HugeiconComponent;
  export const WaveIcon: HugeiconComponent;

  // Wildcard export to support any other icons from hugeicons-react
  const icons: { [key: string]: HugeiconComponent };
  export default icons;
}
