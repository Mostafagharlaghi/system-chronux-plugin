
import {
  Box,
  Text,
} from "@chakra-ui/react";
import { AppChronux} from "@dolphin/ui";
import { useState } from "react";
import { commonArgs } from "./CalendarProps";




export const Calender = () => {
  // تعریف Stateهای مورد نیاز که در کد شما به آن‌ها اشاره شده بود
  const [currentWorkspace, setCurrentWorkspace] = useState<any>(null); 
  const [selectedBranchUuid, setSelectedBranchUuid] = useState<string>(commonArgs.userDefaultBranchUuid);

  const handleSelectBranch = (branchUuid: string) => {
    setSelectedBranchUuid(branchUuid);
  };

  return (
    <Box p={1} dir="ltr" h="full" w="full" display="flex" flexDirection="column">
      <Text></Text>
      <AppChronux 
        {...commonArgs} 
        
        // پراپ‌های داینامیک و State-محور اینجا قرار می‌گیرند:
        key={commonArgs.currentUser?.uuid ?? 'no-user'}
        selectedWorkspace={currentWorkspace}
        onSelectWorkspace={(ws) => {
            setCurrentWorkspace(ws);
            // در صورت نیاز به فراخوانی تابعی از خارج:
            // commonArgs.onSelectWorkspace?.(ws); 
        }}
        selectedBranchUuid={selectedBranchUuid}
        onSelectBranch={handleSelectBranch}
      />
    </Box>
  );
};

export default Calender;
