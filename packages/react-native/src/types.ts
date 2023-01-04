export interface EmojiPickerElementProps {
  onEmojiSelected?: ({ emoji }: { emoji: string }) => void;
  onClose?: () => void;
  open?: boolean;
}
