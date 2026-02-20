import { useNavigate } from "react-router";
import { Button } from "../../components/button/button";
import { MdHome, MdArrowBack } from "react-icons/md";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black rounded-md text-white px-4">
      <p className="text-[8rem] font-bold leading-none text-white/10 select-none">
        404
      </p>
      <h1 className="text-2xl font-semibold mt-2">
        Page not found
      </h1>
      <p className="text-gray-400 text-sm mt-2 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3 mt-8">
        <Button variant="ghost" size="md" rounded="full" onClick={() => navigate(-1)} leftIcon={<MdArrowBack />}>
          Go back
        </Button>
        <Button variant="snow" size="md" rounded="full" onClick={() => navigate("/")} leftIcon={<MdHome />}>
          Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
