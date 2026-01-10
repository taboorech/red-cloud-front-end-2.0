import classNames from "classnames";
import { type ReactNode } from "react";
import MenuButton from "./menu-button/menu-button";

interface ButtonsBlockProps {
  children?: ReactNode;
  className?: string;
  gap?: number;
  buttons?: { to: string; icon: React.ComponentType, size?: string }[];
}

const ButtonsBlock = ({ 
  children, 
  className, 
  gap = 2,
  buttons,
}: ButtonsBlockProps) => {
  return (
    <div className={classNames("flex items-center justify-between", `gap-${gap}`, className)}>
      { buttons ? 
        buttons.map((button, index) => (
          <MenuButton key={index} link={button.to} className={button.size || 'text-2xl'}>
            <button.icon />
          </MenuButton>
        )) 
        : 
        children 
      }
    </div>
  )
}

export default ButtonsBlock;