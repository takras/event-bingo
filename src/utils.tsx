import { Icon } from "./types";

type GetIcon = {
  name: string;
  icons: Icon[];
  className: string;
};
export function getIcon({ name, icons, className }: GetIcon) {
  const icon = icons.find((icon) => icon.name === name);
  if (!icon) {
    return null;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={icon.name} className={className} src={icon.image} />;
}
