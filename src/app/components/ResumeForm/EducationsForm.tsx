import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
} from "components/ResumeForm/Form/InputGroup";
import { MarkdownEditor } from "components/ResumeForm/Form/MarkdownEditor"; // Direct import to avoid circular dependency
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeEducations, selectEducations } from "lib/redux/resumeSlice";
import type { ResumeEducation } from "lib/redux/types";

export const EducationsForm = () => {
  const educations = useAppSelector(selectEducations);
  const dispatch = useAppDispatch();
  const showDelete = educations.length > 1;
  const form = "educations";

  return (
    <Form form={form} addButtonText="Add School">
      {educations.map(({ school, degree, gpa, date, description }, idx) => {
        const handleEducationChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeEducation>
        ) => {
          dispatch(changeEducations({ idx, field, value } as any));
        };

        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== educations.length - 1;

        return (
          <FormSection
            key={idx}
            form="educations"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Delete school"
          >
            <Input
              label="School"
              labelClassName="col-span-4"
              name="school"
              placeholder="Cornell University"
              value={school}
              onChange={handleEducationChange}
            />
            <Input
              label="Date"
              labelClassName="col-span-2"
              name="date"
              placeholder="May 2018"
              value={date}
              onChange={handleEducationChange}
            />
            <Input
              label="Degree & Major"
              labelClassName="col-span-4"
              name="degree"
              placeholder="Bachelor of Science in Computer Engineering"
              value={degree}
              onChange={handleEducationChange}
            />
            <Input
              label="GPA"
              labelClassName="col-span-2"
              name="gpa"
              placeholder="3.81"
              value={gpa}
              onChange={handleEducationChange}
            />
            <MarkdownEditor
              label="Additional Information (Optional)"
              labelClassName="col-span-full"
              name="description"
              placeholder="Use Markdown to format your content. Examples:&#10;&#10;**Bold text** or *italic text*&#10;[Link text](https://example.com)&#10;# Header&#10;- Bullet point&#10;- Another point&#10;&#10;Relevant coursework, awards, activities, etc."
              value={description}
              onChange={handleEducationChange}
            />
          </FormSection>
        );
      })}
    </Form>
  );
};
