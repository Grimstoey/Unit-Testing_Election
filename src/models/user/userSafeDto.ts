// ไม่รวม password
export type UserSafeDto = {
  id: number;
  citizenId: string;
  firstName: string;
  lastName: string;
  address: string;

  provinceId: number;
  districtId: number;
  constituencyId: number | null;

  createdAt: Date;
};
