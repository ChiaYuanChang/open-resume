import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFText,
  MarkdownRenderer,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeProject } from "lib/redux/types";

export const ResumePDFProject = ({
  heading,
  projects,
  themeColor,
}: {
  heading: string;
  projects: ResumeProject[];
  themeColor: string;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {projects.map(({ project, date, description = "" }, idx) => {
        const showDescription = description.trim() !== "";

        return (
          <View key={idx}>
            <View
              style={{
                ...styles.flexRowBetween,
                marginTop: spacing["0.5"],
              }}
            >
              <ResumePDFText bold={true}>{project}</ResumePDFText>
              <ResumePDFText>{date}</ResumePDFText>
            </View>
            {showDescription && (
              <View style={{ ...styles.flexCol, marginTop: spacing["0.5"] }}>
                <MarkdownRenderer
                  content={description}
                />
              </View>
            )}
          </View>
        );
      })}
    </ResumePDFSection>
  );
};
