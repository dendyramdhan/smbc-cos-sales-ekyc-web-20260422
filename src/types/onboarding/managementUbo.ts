export type GroupType = 'INDIVIDUAL' | 'ENTITY';

export interface ManagementUboMember {
  id?: number;
  positionType: string;
  name: string;
  groupType: GroupType;
  authorizedSigner: boolean;
  dateOfBirth?: string;
  nikPassportNo?: string;
  countryOfResidence?: string;
  address?: string;
}
