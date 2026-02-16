export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  timestamp: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: string;
  username: string;
  role: 'AGENT' | 'ADMIN';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName?: string;
}

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'PROPOSAL_SENT'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  source?: string;
  assignedAgent?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source?: string;
  assignedAgent?: string;
  notes?: string;
  status?: LeadStatus;
}

export interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  author?: string;
  createdAt: string;
}

export interface LeadNoteRequest {
  content: string;
  author?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategoryRequest {
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  premiumRange?: string;
  coverageAmount?: string;
  features?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  description?: string;
  categoryId: string;
  premiumRange?: string;
  coverageAmount?: string;
  features?: string;
  active?: boolean;
}

export interface CalendarSlot {
  id: string;
  agentId: string;
  startTime: string;
  endTime: string;
  booked: boolean;
  leadId?: string;
  title?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarSlotRequest {
  agentId: string;
  startTime: string;
  endTime: string;
  title?: string;
  notes?: string;
  booked?: boolean;
  leadId?: string;
}
