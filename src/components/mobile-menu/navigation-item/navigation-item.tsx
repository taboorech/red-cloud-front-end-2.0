import { Button } from "../../button/button";

interface NavigationItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const NavigationItem = ({ icon, label, onClick }: NavigationItemProps) => {
  return (
    <Button variant="ghost" size="lg" className="w-full justify-start gap-3" onClick={onClick}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-center w-full">
          {label}
        </span>
      </div>
    </Button>
  );
};

export default NavigationItem;