import { useColor } from "hooks";

import { IconButton } from "@chakra-ui/react";

function CalendarHeadButton({ icon, onClick }) {
  const color = useColor("blue.500", "blue.200");
  const background = useColor("blue.100", "rgba(144, 205, 244, 0.16)");

  return (
    <IconButton
      color={color}
      background={background}
      size="xs"
      icon={icon}
      onClick={onClick}
    />
  );
}

export default CalendarHeadButton;
