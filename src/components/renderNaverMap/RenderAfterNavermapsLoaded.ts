import { useEffect, useState } from "react";
import loadNavermapsScript from "../../loadNavermapsScript";
import { RenderNaverMapProps } from "./renderNaverMap.type";

const RenderAfterNavermapsLoaded = ({
  loading: loadingProp,
  error: errorProp,
  clientId,
  ncpClientId,
  submodules,
  children,
}: RenderNaverMapProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    loadNavermapsScript({
      clientId,
      ncpClientId,
      submodules,
    })
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  if (loading && loadingProp) {
    return loadingProp;
  }

  if (error && errorProp) {
    return errorProp;
  }

  return children;
};

export default RenderAfterNavermapsLoaded;
