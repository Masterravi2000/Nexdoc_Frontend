import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  uploadImageThunk,
  uploadPdfThunk,
  uploadPptxThunk,
  uploadTxtThunk,
  uploadXlsThunk,
} from "./uploadThunk";
import { fetchUploadStatusThunk } from "../status/fetchUploadStatusThunk";

export type FileTypeId = "pdf" | "xls" | "ppt" | "txt" | "img";

export interface AttachedFile {
  id: string;
  name: string;
  file: File;
}

type AttachedFilesState = Record<FileTypeId, AttachedFile[]>;

interface UploadFile {
  fileId: string;
  filename: string;
  fileType: FileTypeId;
  status?: string;
}

interface FailedFile {
  filename: string;
  reason: string;
}

interface UploadState {
  images: {
    loading: boolean;
    success: boolean;
    error: string | null;
    uploadedFiles: UploadFile[];
    failedFiles: FailedFile[];
  };
  pdf: {
    loading: boolean;
    success: boolean;
    error: string | null;
    uploadedFiles: UploadFile[];
    failedFiles: FailedFile[];
  };
  pptx: {
    loading: boolean;
    success: boolean;
    error: string | null;
    uploadedFiles: UploadFile[];
    failedFiles: FailedFile[];
  };
  xls: {
    loading: boolean;
    success: boolean;
    error: string | null;
    uploadedFiles: UploadFile[];
    failedFiles: FailedFile[];
  };
  txt: {
    loading: boolean;
    success: boolean;
    error: string | null;
    uploadedFiles: UploadFile[];
    failedFiles: FailedFile[];
  };

  uploadedFiles: UploadFile[];

  attached: AttachedFilesState;
}

const initialState: UploadState = {
  images: {
    loading: false,
    success: false,
    error: null,
    uploadedFiles: [],
    failedFiles: [],
  },
  pdf: {
    loading: false,
    success: false,
    error: null,
    uploadedFiles: [],
    failedFiles: [],
  },
  pptx: {
    loading: false,
    success: false,
    error: null,
    uploadedFiles: [],
    failedFiles: [],
  },
  xls: {
    loading: false,
    success: false,
    error: null,
    uploadedFiles: [],
    failedFiles: [],
  },
  txt: {
    loading: false,
    success: false,
    error: null,
    uploadedFiles: [],
    failedFiles: [],
  },
  attached: {
    pdf: [],
    xls: [],
    ppt: [],
    txt: [],
    img: [],
  },
  uploadedFiles: [],
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
    addAttachedFiles: (state, action: PayloadAction<AddFilesPayload>) => {
      state.attached[action.payload.typeId].push(...action.payload.files);
    },

    removeAttachedFile: (state, action: PayloadAction<RemoveFilePayload>) => {
      state.attached[action.payload.typeId] = state.attached[
        action.payload.typeId
      ].filter((file) => file.id !== action.payload.fileId);
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
  extraReducers: (builder) => {
    builder

      // slice for image upload
      .addCase(uploadImageThunk.pending, (state) => {
        state.images.loading = true;
        state.images.success = false;
        state.images.error = null;
      })
      .addCase(uploadImageThunk.fulfilled, (state, action) => {
        state.images.loading = false;
        state.images.success = true;
        state.images.uploadedFiles = action.payload.uploaded_files;
        state.images.failedFiles = action.payload.failed_files;
        state.uploadedFiles.push(
          ...action.payload.uploaded_files.map((file:  UploadFile) => ({
            ...file,
            fileType: "img",
          }))
        )
      })
      .addCase(uploadImageThunk.rejected, (state, action) => {
        state.images.loading = false;
        state.images.success = false;
        state.images.error = action.payload as string;
      })

      // slice for pdf upload
      .addCase(uploadPdfThunk.pending, (state) => {
        state.pdf.loading = true;
        state.pdf.success = false;
        state.pdf.error = null;
      })
      .addCase(uploadPdfThunk.fulfilled, (state, action) => {
        state.pdf.loading = false;
        state.pdf.success = true;
        state.pdf.uploadedFiles = action.payload.uploaded_files;
        state.pdf.failedFiles = action.payload.failed_files;
        state.uploadedFiles.push(
          ...action.payload.uploaded_files.map((file:  UploadFile) => ({
            ...file,
            fileType: "pdf",
          }))
        )
      })
      .addCase(uploadPdfThunk.rejected, (state, action) => {
        state.pdf.loading = false;
        state.pdf.success = false;
        state.pdf.error = action.payload as string;
      })

      // slice for pptx upload
      .addCase(uploadPptxThunk.pending, (state) => {
        state.pptx.loading = true;
        state.pptx.success = false;
        state.pptx.error = null;
      })
      .addCase(uploadPptxThunk.fulfilled, (state, action) => {
        state.pptx.loading = false;
        state.pptx.success = true;
        state.pptx.uploadedFiles = action.payload.uploaded_files;
        state.pptx.failedFiles = action.payload.failed_files;
        state.uploadedFiles.push(
          ...action.payload.uploaded_files.map((file:  UploadFile) => ({
            ...file,
            fileType: "ppt",
          }))
        )
      })
      .addCase(uploadPptxThunk.rejected, (state, action) => {
        state.pptx.loading = false;
        state.pptx.success = false;
        state.pptx.error = action.payload as string;
      })

      // slice for xls upload
      .addCase(uploadXlsThunk.pending, (state) => {
        state.xls.loading = true;
        state.xls.success = false;
        state.xls.error = null;
      })
      .addCase(uploadXlsThunk.fulfilled, (state, action) => {
        state.xls.loading = false;
        state.xls.success = true;
        state.xls.uploadedFiles = action.payload.uploaded_files;
        state.xls.failedFiles = action.payload.failed_files;
        state.uploadedFiles.push(
          ...action.payload.uploaded_files.map((file:  UploadFile) => ({
            ...file,
            fileType: "xls",
          }))
        )
      })
      .addCase(uploadXlsThunk.rejected, (state, action) => {
        state.xls.loading = false;
        state.xls.success = false;
        state.xls.error = action.payload as string;
      })

      // slice for txt upload
      .addCase(uploadTxtThunk.pending, (state) => {
        state.txt.loading = true;
        state.txt.success = false;
        state.txt.error = null;
      })
      .addCase(uploadTxtThunk.fulfilled, (state, action) => {
        state.txt.loading = false;
        state.txt.success = true;
        state.txt.uploadedFiles = action.payload.uploaded_files;
        state.txt.failedFiles = action.payload.failed_files;
        state.uploadedFiles.push(
          ...action.payload.uploaded_files.map((file:  UploadFile) => ({
            ...file,
            fileType: "txt",
          }))
        )
      })
      .addCase(uploadTxtThunk.rejected, (state, action) => {
        state.txt.loading = false;
        state.txt.success = false;
        state.txt.error = action.payload as string;
      })

      //
      .addCase(fetchUploadStatusThunk.fulfilled, (state, action) => {
        const file = state.uploadedFiles.find(
         (f) => f.fileId === action.payload.fileId 
        )
        if (file) {
          file.status = action.payload.status;
        }
      });
  },
});

export const { addAttachedFiles, removeAttachedFile, clearAttachedFiles } =
  uploadSlice.actions;

export default uploadSlice.reducer;
