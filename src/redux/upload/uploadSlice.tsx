import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type FileTypeId = "pdf" | "xls" | "ppt" | "txt" | "img";

export interface AttachedFile {
  id: string;
  name: string;
  file: File;
}

type AttachedFilesState = Record<FileTypeId, AttachedFile[]>;

interface UploadState {
  attached: AttachedFilesState;
}

const initialState: UploadState = {
  attached: {
    pdf: [],
    xls: [],
    ppt: [],
    txt: [],
    img: [],
  },
};

interface AddFilesPayload {
  typeId: FileTypeId;
  files: AttachedFile[];
}

interface RemoveFilePayload {
  typeId: FileTypeId;
  fileId: string;
}

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    addAttachedFiles: (
      state,
      action: PayloadAction<AddFilesPayload>,
    ) => {
      state.attached[action.payload.typeId].push(...action.payload.files);
    },

    removeAttachedFile: (
      state,
      action: PayloadAction<RemoveFilePayload>,
    ) => {
      state.attached[action.payload.typeId] =
        state.attached[action.payload.typeId].filter(
          (file) => file.id !== action.payload.fileId,
        );
    },

    clearAttachedFiles: (state) => {
      state.attached = {
        pdf: [],
        xls: [],
        ppt: [],
        txt: [],
        img: [],
      };
    },
  },
});

export const {
  addAttachedFiles,
  removeAttachedFile,
  clearAttachedFiles,
} = uploadSlice.actions;

export default uploadSlice.reducer;