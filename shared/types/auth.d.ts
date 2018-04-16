declare interface SendSMSParams {
  mobile: string
}

declare interface SendEmailParams {
  email: string
}

declare interface SMSLoginParams {
  mobile: string
  code: string
}

declare interface EmailCallbackParams {
  id: string
}
