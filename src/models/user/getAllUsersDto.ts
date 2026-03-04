export type GetAllUsersQueryDto = {
  page: number
  limit: number
  search?: string
  sortBy?: 'id' | 'createdAt' | 'firstName' | 'lastName'
  order?: 'asc' | 'desc'
  provinceId?: number
}

// ใช้ <T> เพื่อความยืนหยุ่นของ response
// เพราะการส่งคืนการทำงานของแต่ละส่วนอาจมีความต้องการข้อมูลไม่เหมือนกัน
export type GetAllUsersResponseDto<TUser> = {
  total: number
  users: TUser[]
  page: number
  limit: number
  totalPages: number
  provinceId?: number
}
