declare interface UserIdParams {
  id: string
}

declare interface UserProfile {
  ethAddress?: string
  ethDomain?: string
  twoFactorSecret?: string
}

declare interface CreateUserParams {
  nickname?: string
  role: string
  headimgurl?: string
  mobile?: string
  mobileCountry?: string
  describe?: string
  userProfile?: UserProfile
}

declare interface BindUserTwoFactorParams {
  id: string
  secret: string
  token: string
}
