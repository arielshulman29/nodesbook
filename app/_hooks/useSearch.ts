import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { isBackup } from "../_utils/neo4j";

export type SearchParams = {
  key: string;
  value: string | string[] | undefined;
}[];

export default function useSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const backupIsActive = isBackup(searchParams);

  function setSearch(newParams: SearchParams) {
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
  }

  function replaceSearch(newParams: SearchParams) {
    const params = new URLSearchParams();
    newParams.forEach(({ key, value }) => {
      if (value) {
        if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, value);
        }
      }
    });
    if (backupIsActive) {
      params.set("backup", "true");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return { setSearch, searchParams, replaceSearch, backupIsActive };
}
