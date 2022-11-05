import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingSkeletonImage() {
  const SkeletonImage = {
    width: "90%",
    height: "385px",
    transform: "translate(5.5%, 6%)",
    borderRadius: "15px",
    marginBottom: "30px",
  };
  return (
    <div>
      <div className="image-skeleton">
        <Skeleton style={SkeletonImage} />
      </div>
    </div>
  );
}
