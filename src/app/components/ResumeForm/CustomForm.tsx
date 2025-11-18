import { Form } from "components/ResumeForm/Form";
import { MarkdownEditor } from "components/ResumeForm/Form/MarkdownEditor";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeCustom, selectCustom } from "lib/redux/resumeSlice";

export const CustomForm = () => {
  const custom = useAppSelector(selectCustom);
  const dispatch = useAppDispatch();
  const { description } = custom;
  const form = "custom";

  const handleCustomChange = (field: "description", value: string) => {
    dispatch(changeCustom({ field, value }));
  };

  return (
    <Form form={form}>
      <div className="col-span-full grid grid-cols-6 gap-3">
        <MarkdownEditor
          label="Custom Textbox"
          labelClassName="col-span-full"
          name="description"
          placeholder="Use this section for any additional information. Examples:&#10;&#10;**Certifications:**&#10;- AWS Certified Solutions Architect&#10;- Google Cloud Professional&#10;&#10;**Languages:**&#10;- English (Native)&#10;- Spanish (Fluent)&#10;&#10;**Volunteer Work:**&#10;Contributed to [open source projects](https://github.com/username)"
          value={description}
          onChange={handleCustomChange}
        />
      </div>
    </Form>
  );
};
