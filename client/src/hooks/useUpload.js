import axios from "axios";

export const useUpload = async ({ image, onUploadProgress }) => {
  const upload = async () => {
    try {
      let formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "codedate");
      formData.append("cloud_name", "jatincloud809");

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: onUploadProgress,
        withCredentials: false,
      };
      //https://api.cloudinary.com/v1_1/demo/image/upload
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/jatincloud809/image/upload",
        formData,
        config
      );

      const data = await res.data;

      if (!data) {
        throw new Error("Error Uploading image");
      }

      return {
        public_id: data.public_id,
        url: data.secure_url,
      };
    } catch (error) {
      return error.message;
    }
  };
  const { public_id, url } = await upload();
  return {
    public_id,
    url,
  };
};
