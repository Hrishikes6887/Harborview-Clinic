export type Department = 'General Medicine' | 'Cardiology' | 'Dermatology' | 'Pediatrics' | 'Orthopedics' | 'Dental Care'

export type BookingDetails = {
  department: Department
  doctor: string
  date: string
  time: string
  patientName: string
  email: string
  phone: string
  reason: string
}

export type BookingResponse = {
  success: boolean
  confirmationId?: string
  message: string
}
