import { Skeleton } from "@nextui-org/react";
import React from "react";

export default function PostsSectionSkeleton({
  isEvent,
}: {
  isEvent?: boolean;
}) {
  return (
    <div
      className={`flex flex-col md:flex-row ${
        isEvent ? "" : "-mt-12"
      } md:space-x-3`}
    >
      {[1, 2, 3].map((id) => (
        <div key={id} className="max-w-xs flex-1 space-y-3 mb-5">
          <Skeleton className="rounded-lg">
            <div className="h-40 rounded-lg bg-default-300"></div>
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <div className="max-w-[300px] w-full flex items-center gap-3">
              <div>
                <Skeleton className="flex rounded-full w-12 h-12" />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Skeleton className="h-3 w-4/5 rounded-lg" />
                <Skeleton className="h-3 w-3/5 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
