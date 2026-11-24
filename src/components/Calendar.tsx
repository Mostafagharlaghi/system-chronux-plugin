import { Alert, Box, Button, Text } from "@chakra-ui/react";
import { AppChronux } from "@dolphin/ui";
import { useState } from "react";
import { useBranches } from "../hooks/useBranches";
import { commonArgs } from "./CalendarProps";

export const Calender = () => {
  const [currentWorkspace, setCurrentWorkspace] = useState<any>(null);
  const {
    branches,
    selectedBranchUuid,
    setSelectedBranchUuid,
    loading,
    errorMessage,
    retry,
  } = useBranches();

  const handleSelectBranch = (branchUuid: string) => {
    setSelectedBranchUuid(branchUuid);
  };

  if (loading) {
    return (
      <Box p={4} dir="rtl">
        <Text>در حال دریافت فهرست شعب...</Text>
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box p={4} dir="rtl">
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Description>{errorMessage}</Alert.Description>
        </Alert.Root>
        <Button onClick={retry}>تلاش مجدد</Button>
      </Box>
    );
  }

  if (branches.length === 0) {
    return (
      <Box p={4} dir="rtl">
        <Text>هیچ شعبه‌ای برای نمایش وجود ندارد.</Text>
      </Box>
    );
  }
  return (
    <Box
      p={1}
      dir="ltr"
      h="full"
      w="full"
      display="flex"
      flexDirection="column"
    >
      <Text></Text>
      <AppChronux
        {...commonArgs}
        branches={branches}
        userDefaultBranchUuid={selectedBranchUuid}
        key={commonArgs.currentUser?.uuid ?? "no-user"}
        selectedWorkspace={currentWorkspace}
        onSelectWorkspace={(ws) => {
          setCurrentWorkspace(ws);
        }}
        selectedBranchUuid={selectedBranchUuid}
        onSelectBranch={handleSelectBranch}
      />
    </Box>
  );
};

export default Calender;
