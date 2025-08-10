import Image from "next/image";
import React, { useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";

interface ImageUploadProps {
  previews: string[];
  files: (File | null)[];
  onChange: (updatedFiles: (File | null)[]) => void;
}

export default function ImageUpload({
  previews,
  files,
  onChange,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  const handleBoxClick = (index: number) => {
    setTargetIndex(index);
    fileInputRef.current?.click();
  };

  const handleRemove = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles[index] = null;
    onChange(updatedFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && targetIndex !== null) {
      const file = e.target.files[0];
      if (!file) return;

      const updatedFiles = [...files];
      updatedFiles[targetIndex] = file;

      onChange(updatedFiles);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex gap-2 mt-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="relative w-20 h-20 border flex items-center justify-center bg-gray-50 rounded overflow-hidden cursor-pointer"
            onClick={() => handleBoxClick(i)}
          >
            {previews[i] ? (
              <>
                <Image
                  src={previews[i]}
                  alt={`Preview ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(i);
                  }}
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                >
                  <FaTimes className="text-white text-xs" />
                </button>
              </>
            ) : (
              <span className="text-gray-400 text-2xl">+</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
