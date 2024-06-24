import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { isBackup } from "../_utils/neo4j";
import { useCallback } from "react";

export type SearchParams = {
  key: string;
  value: string | string[] | undefined;
}[];

export default function useSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const setSearch = (newParams: SearchParams) => {
    const params = new URLSearchParams(searchParams);
    newParams.forEach(({ key, value }) => {
      if (value) {
        if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, value);
        }
      } else {
        params.delete(key);
      }
    });
    replace(`${pathname}?${params.toString()}`);
  };

  const replaceSearch = (newParams: SearchParams) => {
    const params = new URLSearchParams();
    const backupIsActive = isBackup(searchParams);
    if (backupIsActive) {
      params.set("backup", "backup");
    }
    newParams.forEach(({ key, value }) => {
      if (value) {
        if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, value);
        }
      }
    });
    replace(`${pathname}?${params.toString()}`);
  };

  return { setSearch, searchParams, replaceSearch };
}
