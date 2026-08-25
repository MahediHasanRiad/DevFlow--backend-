export interface QueryType {
    page?: number;
    limit?: number;
    sortBy?: 'asc' | 'desc';
    sortType?: string;
    search?: string
}

export type responsibilityType = 'UI_UX' | 'FRONTEND' | 'BACKEND' | 'FULL_STACK' | 'QA' | 'DEVOPS' | 'TEAM_LEAD'
  
  export interface TeamMemberType {
  teamId: string;
  userId: string;
  responsibility: responsibilityType;
}