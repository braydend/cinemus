import { type FC, type ReactElement } from "react";
import MuiTooltip from "@mui/material/Tooltip";

type Props = { content: string; children: ReactElement };

export const Tooltip: FC<Props> = ({ children, content }) => {
  return (
    <MuiTooltip disableFocusListener title={content}>
      <div>{children}</div>
    </MuiTooltip>
  );
};
