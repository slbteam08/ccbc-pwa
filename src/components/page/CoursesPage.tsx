import Icon from "@/components/shared/atoms/Icons/Icon";

/**
 * Courses page component
 * Displays church courses and classes
 */
function CoursesPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <Icon name="class" />
        <h2 className="text-xl font-semibold mb-2">課程</h2>
        <p className="text-gray-600">Church courses and classes</p>
      </div>
    </div>
  );
}

export default CoursesPage;