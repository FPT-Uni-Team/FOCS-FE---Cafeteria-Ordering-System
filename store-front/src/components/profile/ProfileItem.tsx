const ProfileItem = ({
  icon,
  label,
  onClickIcon,
}: {
  icon: React.ReactNode;
  label: string;
  onClickIcon?: () => void;
}) => {
  return (
    <div
      className="flex items-center justify-between px-1 py-3 hover:bg-gray-100 rounded-md cursor-pointer"
      onClick={onClickIcon}
    >
      <div className="flex items-center gap-3 text-gray-800">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
};
export default ProfileItem;
