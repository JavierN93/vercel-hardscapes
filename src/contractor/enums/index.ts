export enum CustomPaymentItemType {
  Rent = 'RENT',
}

export enum SubContractMilestoneType {
  Deposit = 'DEPOSIT',
  Final = 'FINAL',
}

export enum SubContractStatus {
  Invited = 'INVITED',
  SitePlanned = 'SITE_PLANNED',
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  SiteVisited = 'SITE_VISITED',
  Excavated = 'EXCAVATED',
  GradeSet = 'GRADE_SET',
  BaseInstalled = 'BASE_INSTALLED',
  Screeded = 'SCREEDED',
  HardscapeInstalled = 'HARDSCAPE_INSTALLED',
  Adjusted = 'ADJUSTED',
  CleanedUp = 'CLEANED_UP',
  FinalPhotosTaken = 'FINAL_PHOTOS_TAKEN',
  MaterialReturned = 'MATERIAL_RETURNED',
}

export enum LegalTermType {
  SubContractorAgreement = 'SUB_CONTRACTOR_AGREEMENT',
  NDA = 'NDA',
  WorkingAgreement = 'WORKING_AGREEMENT',
}

export enum SubContractDeclineReason {
  OverlapProjects = 'OVERLAP_PROJECTS',
  NoCrewAvailable = 'NO_CREW_AVAILABLE',
  OutOfServiceAreaRadius = 'OUT_OF_SERVICE_AREA_RADIUS',
  Other = 'OTHER',
}
