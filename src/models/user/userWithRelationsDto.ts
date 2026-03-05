export type UserRoleDto = {
  role: {
    id: number
    name: string
  }
}

export type ProvinceDto = {
  id: number
  name: string
}

export type DistrictDto = {
  id: number
  name: string
  provinceId: number
}

export type ConstituencyDto = {
  id: number
  number: number
  provinceId: number
  isClosed: boolean
}

export type VoteDto = {
  id: number
  createdAt: Date
  candidateId: number
  candidateNumber: number
  constituencyId: number
  constituencyNumber: number
}

export type UserWithRelationsDto = {
  id: number
  citizenId: string
  firstName: string
  lastName: string
  address: string

  provinceId: number
  districtId: number

  createdAt: Date

  province: ProvinceDto

  district: {
    id: number
    name: string
  }
  constituency: ConstituencyDto
  roles: UserRoleDto[]
  vote: VoteDto | null
}
