import classNames from "classnames";

interface CardProps {
  children: React.ReactNode;
  padding?: string;
  className?: string;
}

const Card = ({ children, padding = "p-5", className }: CardProps) => (
  <div
    className={classNames(
      "rounded-2xl bg-app-elev border border-app-line",
      padding,
      className
    )}
  >
    {children}
  </div>
);

export default Card;
