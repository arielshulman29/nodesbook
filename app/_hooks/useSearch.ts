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
  console.log(searchParams);
  const backupIsActive = isBackup(searchParams);
  console.log(backupIsActive);

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
    if (backupIsActive) {
      console.log(backupIsActive);
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
  }

  return { setSearch, searchParams, replaceSearch, backupIsActive };
}
