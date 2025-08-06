import React from "react";

const SkeletonBox = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded-md ${className}`} />
);

const ProfileSkeleton = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        <SkeletonBox className="h-10 w-full" />
        <SkeletonBox className="h-10 w-full" />
      </div>
      <SkeletonBox className="h-10 w-full" />
      <SkeletonBox className="h-10 w-full" />
      <SkeletonBox className="h-12 w-full mt-4" />
    </div>
  );
};

export default ProfileSkeleton;
