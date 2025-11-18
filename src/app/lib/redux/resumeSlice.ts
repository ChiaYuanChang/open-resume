import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "lib/redux/store";
import type {
  FeaturedSkill,
  Resume,
  ResumeEducation,
  ResumeProfile,
  ResumeProject,
  ResumeSkills,
  ResumeWorkExperience,
} from "lib/redux/types";
import type { ShowForm } from "lib/redux/settingsSlice";

export const initialProfile: ResumeProfile = {
  name: "",
  summary: "",
  email: "",
  phone: "",
  location: "",
  url: "",
};

export const initialWorkExperience: ResumeWorkExperience = {
  company: "",
  jobTitle: "",
  date: "",
  description: "",
};

export const initialEducation: ResumeEducation = {
  school: "",
  degree: "",
  gpa: "",
  date: "",
  description: "",
};

export const initialProject: ResumeProject = {
  project: "",
  date: "",
  description: "",
};

export const initialFeaturedSkill: FeaturedSkill = { skill: "", rating: 4 };
export const initialFeaturedSkills: FeaturedSkill[] = Array(6).fill({
  ...initialFeaturedSkill,
});
export const initialSkills: ResumeSkills = {
  featuredSkills: initialFeaturedSkills,
  descriptions: [],
};

export const initialCustom = {
  description: "",
};

export const initialResumeState: Resume = {
  profile: initialProfile,
  workExperiences: [initialWorkExperience],
  educations: [initialEducation],
  projects: [initialProject],
  skills: initialSkills,
  custom: initialCustom,
};

// Keep the field & value type in sync with CreateHandleChangeArgsWithDescriptions (components\ResumeForm\types.ts)
export type CreateWorkExperienceChangeAction = {
  idx: number;
} & (
  | {
      field: Exclude<keyof ResumeWorkExperience, "description">;
      value: string;
    }
  | { field: "description"; value: string }
);

// Specific type for Education changes
export type CreateEducationChangeAction = {
  idx: number;
} & (
  | {
      field: Exclude<keyof ResumeEducation, "description">;
      value: string;
    }
  | { field: "description"; value: string }
);

// Specific type for Project changes
export type CreateProjectChangeAction = {
  idx: number;
} & (
  | {
      field: Exclude<keyof ResumeProject, "description">;
      value: string;
    }
  | { field: "description"; value: string }
);

// Specific type for Custom changes
export type CreateCustomChangeAction = {
  field: "description";
  value: string;
};

export const resumeSlice = createSlice({
  name: "resume",
  initialState: initialResumeState,
  reducers: {
    changeProfile: (
      draft,
      action: PayloadAction<{ field: keyof ResumeProfile; value: string }>
    ) => {
      const { field, value } = action.payload;
      draft.profile[field] = value;
    },
    changeWorkExperiences: (
      draft,
      action: PayloadAction<CreateWorkExperienceChangeAction>
    ) => {
      const { idx, field, value } = action.payload;
      const workExperience = draft.workExperiences[idx];
      workExperience[field] = value as any;
    },
    changeEducations: (
      draft,
      action: PayloadAction<CreateEducationChangeAction>
    ) => {
      const { idx, field, value } = action.payload;
      const education = draft.educations[idx];
      education[field] = value as any;
    },
    changeProjects: (
      draft,
      action: PayloadAction<CreateProjectChangeAction>
    ) => {
      const { idx, field, value } = action.payload;
      const project = draft.projects[idx];
      project[field] = value as any;
    },
    changeSkills: (
      draft,
      action: PayloadAction<
        | { field: "descriptions"; value: string[] }
        | {
            field: "featuredSkills";
            idx: number;
            skill: string;
            rating: number;
          }
      >
    ) => {
      const { field } = action.payload;
      if (field === "descriptions") {
        const { value } = action.payload;
        draft.skills.descriptions = value;
      } else {
        const { idx, skill, rating } = action.payload;
        const featuredSkill = draft.skills.featuredSkills[idx];
        featuredSkill.skill = skill;
        featuredSkill.rating = rating;
      }
    },
    changeCustom: (
      draft,
      action: PayloadAction<CreateCustomChangeAction>
    ) => {
      const { field, value } = action.payload;
      draft.custom[field] = value;
    },
    addSectionInForm: (draft, action: PayloadAction<{ form: ShowForm }>) => {
      const { form } = action.payload;
      switch (form) {
        case "workExperiences": {
          draft.workExperiences.push(structuredClone(initialWorkExperience));
          return draft;
        }
        case "educations": {
          draft.educations.push(structuredClone(initialEducation));
          return draft;
        }
        case "projects": {
          draft.projects.push(structuredClone(initialProject));
          return draft;
        }
      }
    },
    moveSectionInForm: (
      draft,
      action: PayloadAction<{
        form: ShowForm;
        idx: number;
        direction: "up" | "down";
      }>
    ) => {
      const { form, idx, direction } = action.payload;
      if (form !== "skills" && form !== "custom") {
        if (
          (idx === 0 && direction === "up") ||
          (idx === draft[form].length - 1 && direction === "down")
        ) {
          return draft;
        }

        const section = draft[form][idx];
        if (direction === "up") {
          draft[form][idx] = draft[form][idx - 1];
          draft[form][idx - 1] = section;
        } else {
          draft[form][idx] = draft[form][idx + 1];
          draft[form][idx + 1] = section;
        }
      }
    },
    deleteSectionInFormByIdx: (
      draft,
      action: PayloadAction<{ form: ShowForm; idx: number }>
    ) => {
      const { form, idx } = action.payload;
      if (form !== "skills" && form !== "custom") {
        draft[form].splice(idx, 1);
      }
    },
    setResume: (draft, action: PayloadAction<Resume>) => {
      return action.payload;
    },
  },
});

export const {
  changeProfile,
  changeWorkExperiences,
  changeEducations,
  changeProjects,
  changeSkills,
  changeCustom,
  addSectionInForm,
  moveSectionInForm,
  deleteSectionInFormByIdx,
  setResume,
} = resumeSlice.actions;

export const selectResume = (state: RootState) => state.resume;
export const selectProfile = (state: RootState) => state.resume.profile;
export const selectWorkExperiences = (state: RootState) =>
  state.resume.workExperiences;
export const selectEducations = (state: RootState) => state.resume.educations;
export const selectProjects = (state: RootState) => state.resume.projects;
export const selectSkills = (state: RootState) => state.resume.skills;
export const selectCustom = (state: RootState) => state.resume.custom;

export default resumeSlice.reducer;
