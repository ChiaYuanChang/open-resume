import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFText,
  MarkdownRenderer,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeEducation } from "lib/redux/types";

export const ResumePDFEducation = ({
  heading,
  educations,
  themeColor,
}: {
  heading: string;
  educations: ResumeEducation[];
  themeColor: string;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {educations.map(
        ({ school, degree, date, gpa, description = "" }, idx) => {
          // Hide school name if it is the same as the previous school
          const hideSchoolName =
            idx > 0 && school === educations[idx - 1].school;
          const showDescription = description.trim() !== "";

          return (
            <View key={idx}>
              {!hideSchoolName && (
                <ResumePDFText bold={true}>{school}</ResumePDFText>
              )}
              <View
                style={{
                  ...styles.flexRowBetween,
                  marginTop: hideSchoolName
                    ? "-" + spacing["1"]
                    : spacing["1.5"],
                }}
              >
                <ResumePDFText>{`${
                  gpa
                    ? `${degree} - ${Number(gpa) ? gpa + " GPA" : gpa}`
                    : degree
                }`}</ResumePDFText>
                <ResumePDFText>{date}</ResumePDFText>
              </View>
              {showDescription && (
                <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
                  <MarkdownRenderer
                    content={description}
                  />
                </View>
              )}
            </View>
          );
        }
      )}
    </ResumePDFSection>
  );
};
