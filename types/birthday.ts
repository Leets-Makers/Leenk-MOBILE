export interface BirthdayUser {
  userId: number;
  thumbnail: string;
  name: string;
  isUserBirthdayToday: boolean;
}

export interface BirthdayData {
  users: BirthdayUser[];
  myBirthdayLettersCounts: number;
  hasNewLetters: boolean;
}

export interface BirthdayLetter {
  letterId: number;
  author: BirthdayUser;
  message: string;
  createdAt: string;
}

export interface UpcomingBirthdayUser {
  userId: number;
  thumbnail: string;
  name: string;
  isUserBirthdayToday: boolean;
  birthday: string;
}

export interface UpcomingBirthdayData {
  users: UpcomingBirthdayUser[];
}

export interface BirthdayLetterPayload {
  message: string;
}
