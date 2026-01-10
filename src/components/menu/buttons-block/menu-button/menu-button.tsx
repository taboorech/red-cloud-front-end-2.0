import { useNavigate } from "react-router";
import { Button } from "../../../button/button"
import type { ReactNode } from "react";

interface MenuButtonProps {
  link: string;
  children: ReactNode;
  className?: string;
}

const MenuButton = ({ link, children, className }: MenuButtonProps) => {
  const navigate = useNavigate()

  const clickHandler = () => {
    navigate(link)
  }

  return (
    <Button variant="ghost" size="circle" rounded="full" onClick={clickHandler} className={className}>
      { children }
    </Button>
  )
}

export default MenuButton;