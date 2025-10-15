import Icon from "@/components/shared/atoms/Icons/Icon";
import { useGetArticleQuery } from "@/store/apiSlice";

interface FetchBaseQueryError {
  status: number | string;
  data?: unknown;
}

interface SerializedError {
  message?: string;
}

/**
 * Renders error message from RTK Query error object
 * @param error - RTK Query error object (FetchBaseQueryError or SerializedError)
 * @returns Formatted error string
 */
const renderError = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    if ("status" in error) {
      // FetchBaseQueryError
      const fetchError = error as FetchBaseQueryError;
      return `Error ${fetchError.status}: ${JSON.stringify(fetchError.data || "Unknown error")}`;
    }
    if ("message" in error) {
      // SerializedError
      const serializedError = error as SerializedError;
      return `Error: ${serializedError.message || "Unknown error"}`;
    }
  }
  return `Error: ${String(error)}`;
};

/**
 * Sermon page component
 * Displays sermon listening interface with article data
 */
function SermonPage() {
  const { data, error, isLoading } = useGetArticleQuery();

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="text-center mb-6">
        <Icon name="speech" />
        <h2 className="text-xl font-semibold mb-2">聽道</h2>
        <p className="text-gray-600">Listen to sermons</p>
      </div>

      {/* Article Data Section */}
      <div className="w-full max-w-4xl">
        {isLoading && (
          <div className="text-center">
            <p className="text-gray-500">Loading articles...</p>
          </div>
        )}

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
            <pre className="text-red-700 text-sm whitespace-pre-wrap overflow-auto">
              {renderError(error) as React.ReactNode}
            </pre>
          </div>
        ) : null}

        {data && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-green-800 font-semibold mb-2">Article Data:</h3>
            <pre className="text-green-700 text-sm whitespace-pre-wrap overflow-auto bg-white p-3 rounded border">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default SermonPage;
