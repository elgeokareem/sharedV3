import { UserType } from "shared/types";

export const MAX_IMAGE_SIZE = 1000000;

export const validateAvatarFileSize = (fileSize: number) => {
  if (fileSize > MAX_IMAGE_SIZE) {
    return 'Please upload an image with size less than 1MB';
  }
  return '';
};

export const validateEmail = (email: string) => {
  if (email?.length === 0) {
    return false;
  }
  const mailFormat =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return mailFormat.test(email);
};

export const updateUserValidator = (user: UserType) => {
  if (!user?.firstName) {
    return 'Please input First Name';
  }

  if (!user?.lastName) {
    return 'Please input Last Name';
  }

  if (!user?.avatar) {
    return 'Please add a Profile Photo to edit your account';
  }

  if (!user?.email) {
    return 'Please input email address';
  }

  if (!validateEmail(user?.email)) {
    return 'Please input a valid email address';
  }
};
