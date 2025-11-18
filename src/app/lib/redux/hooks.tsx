import { useEffect } from "react";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { store, type RootState, type AppDispatch } from "lib/redux/store";
import {
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
} from "lib/redux/local-storage";
import { initialResumeState, setResume } from "lib/redux/resumeSlice";
import {
  initialSettings,
  setSettings,
  type Settings,
} from "lib/redux/settingsSlice";
import { deepMerge } from "lib/deep-merge";
import type { Resume } from "lib/redux/types";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hook to save store to local storage on store change
 */
export const useSaveStateToLocalStorageOnChange = () => {
  useEffect(() => {
    return store.subscribe(() => {
      saveStateToLocalStorage(store.getState());
    });
  }, []);
};

export const useSetInitialStore = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const state = loadStateFromLocalStorage();
    if (!state) return;
    if (state.resume) {
      // We merge the initial state with the stored state to ensure
      // backward compatibility, since new fields might be added to
      // the initial state over time.
      const mergedResumeState = deepMerge(
        initialResumeState,
        state.resume
      ) as Resume;
      migrateLegacyResumeDescriptions(mergedResumeState);
      dispatch(setResume(mergedResumeState));
    }
    if (state.settings) {
      const mergedSettingsState = deepMerge(
        initialSettings,
        state.settings
      ) as Settings;
      dispatch(setSettings(mergedSettingsState));
    }
  }, [dispatch]);
};

type LegacyDescriptionEntity = {
  description?: unknown;
  descriptions?: unknown;
};

const convertLegacyDescriptionsToMarkdown = (descriptions?: unknown) => {
  if (!Array.isArray(descriptions)) {
    return "";
  }
  const normalized = descriptions
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter(Boolean);
  if (normalized.length === 0) {
    return "";
  }
  return normalized
    .map((entry) => (entry.startsWith("-") || entry.startsWith("*") ? entry : `- ${entry}`))
    .join("\n");
};

const normalizeLegacyDescriptionEntities = (
  entities: LegacyDescriptionEntity[]
) => {
  entities.forEach((entity) => {
    const safeDescription =
      typeof entity.description === "string" ? entity.description : "";
    entity.description = safeDescription;
    if (!safeDescription.trim()) {
      const markdown = convertLegacyDescriptionsToMarkdown(entity.descriptions);
      if (markdown) {
        entity.description = markdown;
      }
    }
    delete entity.descriptions;
  });
};

const migrateLegacyResumeDescriptions = (resume: Resume) => {
  normalizeLegacyDescriptionEntities(
    resume.workExperiences as unknown as LegacyDescriptionEntity[]
  );
  normalizeLegacyDescriptionEntities(
    resume.educations as unknown as LegacyDescriptionEntity[]
  );
  normalizeLegacyDescriptionEntities(
    resume.projects as unknown as LegacyDescriptionEntity[]
  );
  normalizeLegacyDescriptionEntities([
    resume.custom as unknown as LegacyDescriptionEntity,
  ]);
};
