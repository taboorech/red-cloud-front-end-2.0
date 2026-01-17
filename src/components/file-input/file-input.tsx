import classNames from "classnames";
import { type InputHTMLAttributes } from "react";

interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string;
  label: string;
  accept: string;
  preview?: string;
}

const FileInput = ({ error, label, accept, preview, className, ...props }: FileInputProps) => {
  return (
    <div className="w-full">
      <label className="block text-gray-300 text-sm mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <label
          className={classNames(
            "cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors border-2 border-dashed",
            error ? "border-red-500" : "border-gray-500 hover:border-gray-400",
            className
          )}
        >
          <span>Choose File</span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            {...props}
          />
        </label>
        {preview && (
          <div className="flex-shrink-0">
            {accept.includes('image') ? (
              <img
                src={preview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-300">Audio</span>
              </div>
            )}
          </div>
        )}
      </div>
      {error && <span className="text-[10px] text-red-500 mt-1 block">{error}</span>}
    </div>
  );
};

export default FileInput;