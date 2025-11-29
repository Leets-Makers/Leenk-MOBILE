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

export interface BirthdayLetter extends BirthdayUser {
  letterId: number;
  message: string;
  createdAt: string;
}

export interface UpcomingBirthdayUser extends BirthdayUser {
  birthday: string;
}

export interface UpcomingBirthdayData {
  users: UpcomingBirthdayUser[];
}

export interface BirthdayLetterPayload {
  message: string;
}
