export interface PartyStats {
  id: number
  name: string
  logoUrl: string
  seats: number
}

export interface ConstituencyStats {
  id: number
  name: string
  candidates: CandidateStats[]
}

export interface CandidateStats {
  id: number
  name: string
  party: PartyStats
  votes: number
}
