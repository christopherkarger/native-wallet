import { useEffect, useState } from "react";

interface IFetchHeader {
  headers?: {
    [key: string]: string;
  };
}

export const useFetch = (url: string, fetchHeaders?: IFetchHeader) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const data = await fetch(url, fetchHeaders).then((response) =>
          response.json()
        );
        setData(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    loading,
    error,
    data,
  };
};
