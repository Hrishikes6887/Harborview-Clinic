import type { Department } from './types'

export const departments: { name: Department; description: string; icon: string }[] = [
  { name: 'General Medicine', description: 'Everyday health, prevention and long-term wellbeing.', icon: '✚' },
  { name: 'Cardiology', description: 'Expert heart care with a personal approach.', icon: '♡' },
  { name: 'Dermatology', description: 'Healthy skin starts with the right support.', icon: '◌' },
  { name: 'Pediatrics', description: 'Gentle, thoughtful care for growing families.', icon: '✳' },
  { name: 'Orthopedics', description: 'Specialized support for movement and bone health.', icon: '◇' },
  { name: 'Dental Care', description: 'Thoughtful care for healthy smiles.', icon: '☼' },
]

export const doctors = [
  { name: 'Dr. Emily Carter', specialty: 'General Medicine', department: 'General Medicine', image: '/doctor-emily.jpg' },
  { name: 'Dr. Adrian Cole', specialty: 'Cardiology', department: 'Cardiology', image: '/doctor-adrian.jpg' },
  { name: 'Dr. Sarah Mitchell', specialty: 'Dermatology', department: 'Dermatology', image: '/doctor-sarah.jpg' },
  { name: 'Dr. Olivia Bennett', specialty: 'Pediatrics', department: 'Pediatrics', image: '/doctor-olivia.jpg' },
  { name: 'Dr. James Wilson', specialty: 'Orthopedics', department: 'Orthopedics', image: '/doctor-james.jpg' },
  { name: 'Dr. Daniel Brooks', specialty: 'Dentistry', department: 'Dental Care', image: '/doctor-daniel.jpg' },
]

export const demoSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM']
