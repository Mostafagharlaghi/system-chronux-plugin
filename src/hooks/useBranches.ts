import { useCallback, useEffect, useState } from "react";
import { getBranches, type CalendarBranch } from "../Api/BranchesApi";

export function useBranches() {
  const [branches, setBranches] = useState<CalendarBranch[]>([]);
  const [selectedBranchUuid, setSelectedBranchUuid] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadBranches = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const branchList = await getBranches(signal);
      setBranches(branchList);
      setSelectedBranchUuid((selectedUuid) =>
        branchList.some((branch) => branch.branch_uuid === selectedUuid)
          ? selectedUuid
          : (branchList[0]?.branch_uuid ?? ""),
      );
    } catch (error: unknown) {
      if (signal?.aborted) return;
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "دریافت فهرست شعب با خطا مواجه شد.",
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadBranches(controller.signal);
    return () => controller.abort();
  }, [loadBranches]);

  const retry = useCallback(() => {
    void loadBranches();
  }, [loadBranches]);

  return {
    branches,
    selectedBranchUuid,
    setSelectedBranchUuid,
    loading,
    errorMessage,
    retry,
  };
}
