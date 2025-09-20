import Icon from "@/components/shared/atoms/Icons/Icon";

/**
 * Sermon page component
 * Displays sermon listening interface
 */
function SermonPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <Icon name="speech" />
        <h2 className="text-xl font-semibold mb-2">聽道</h2>
        <p className="text-gray-600">Listen to sermons</p>
      </div>
    </div>
  );
}

export default SermonPage;