import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  MarkdownRenderer,
} from "components/Resume/ResumePDF/common";
import { styles } from "components/Resume/ResumePDF/styles";
import type { ResumeCustom } from "lib/redux/types";

export const ResumePDFCustom = ({
  heading,
  custom,
  themeColor,
}: {
  heading: string;
  custom: ResumeCustom;
  themeColor: string;
}) => {
  const { description } = custom;
  const showDescription = description.trim() !== "";

  if (!showDescription) {
    return null;
  }

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      <View style={{ ...styles.flexCol }}>
        <MarkdownRenderer
          content={description}
        />
      </View>
    </ResumePDFSection>
  );
};
