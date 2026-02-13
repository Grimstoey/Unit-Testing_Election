export type UserRoleDto = {
  role: {
    id: number;
    name: string;
  };
};

export type ProvinceDto = {
  id: number;
  name: string;
};

export type DistrictDto = {
  id: number;
  name: string;
  provinceId: number;
};

export type ConstituencyDto = {
  id: number;
  number: number;
  provinceId: number;
  isClosed: boolean;
};

export type VoteDto = {
  id: number;
  candidateId: number;
  constituencyId: number;
  createdAt: Date;
};

export type UserWithRelationsDto = {
  id: number;
  citizenId: string;
  firstName: string;
  lastName: string;
  address: string;

  provinceId: number;
  districtId: number;
  constituencyId: number | null;

  createdAt: Date;

  province: ProvinceDto;
  district: DistrictDto;
  constituency: ConstituencyDto | null;

  roles: UserRoleDto[];
  vote: VoteDto | null;
};
