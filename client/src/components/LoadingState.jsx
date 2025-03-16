import { Skeleton } from "@/components/ui/skeleton";

const LoadingState = () => {
  const skeletonCards = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletonCards.map((index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <Skeleton className="h-48 w-full" />
          <div className="p-5">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
