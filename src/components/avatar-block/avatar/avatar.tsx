import { useState } from "react";
import { pickGradient, STRIPE_OVERLAY_CLASS } from "../../../utils/gradients";

interface AvatarProps {
  src?: string;
  alt?: string;
}

const Avatar = ({ src, alt = "User Avatar" }: AvatarProps) => {
  const [broken, setBroken] = useState(false);
  const showImage = src && !broken;

  return (
    <div
      className="relative w-full h-full rounded-full overflow-hidden bg-app-soft"
      style={!showImage ? { background: pickGradient(alt) } : undefined}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <span className={STRIPE_OVERLAY_CLASS} />
      )}
    </div>
  );
};

export default Avatar;