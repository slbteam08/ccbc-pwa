import Icon from "@/components/shared/atoms/Icons/Icon";

/**
 * Weekly newsletter page component
 * Displays church weekly newsletter content
 */
function WeeklyPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <Icon name="newspaper" />
        <h2 className="text-xl font-semibold mb-2">週刊</h2>
        <p className="text-gray-600">Church weekly newsletter</p>
      </div>
    </div>
  );
}

export default WeeklyPage;