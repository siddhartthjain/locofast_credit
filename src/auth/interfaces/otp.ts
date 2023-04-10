export type AttemptData = null | {
  attempts: number;
  lastOtpActionAt: string;
  otp: number;
};

export type SMSData = {
  mobiles: string;
  var: string; // OTP
};

export type ReferenceCodeData = {
  mobiles: string;
  var1: string;
  var2: string;
  var3: string;
  var4: string;
};

export type BulkApprovalCodeData = {
  mobiles: string;
  var1: string;
  var2: string;
  var3: number;
};
