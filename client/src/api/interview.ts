import { request } from './client';

export type GapType = 'HAPPY_PATH_ONLY' | 'BUZZWORD_BLUFF' | 'CHANGING_REQUIREMENTS' | 'DEFENSIVE_RESPONSE' | 'NONE';

export interface Diagnosis {
  gapDetected: GapType;
  evidenceSpan: string;
  note: string;
}

export interface Failure {
  criterion: string;
  description: string;
}

export interface Scorecard {
  scenarioTitle: string;
  finalScore: number;
  failures: Failure[];
}

export interface InterviewResponse {
  interviewId?: string;
  isFinalVerdict: boolean;
  nextInterviewerMessage: string;
  feedback?: string;
  diagnosis: Diagnosis;
  finalScorecard: Scorecard | null;
}

export interface StartInterviewParams {
  scenario: string;
  userId?: string;
}
export interface Turn {
  role: 'interviewer' | 'candidate';
  content: string;
  diagnosis?: Diagnosis;
  feedback?: string;
}

export interface SendMessageParams {
  interviewId: string | null;
  scenario: string;
  history: Turn[];
  candidateMessage: string;
  userId?: string;
}

export interface HistoryItem {
  id: string;
  userId: string;
  scenarioId: string;
  currentStep: string;
  turnCount: number;
  score: number | null;
  verdict: string | null;
  gapDetected: GapType | null;
  history: Turn[];
  createdAt: string;
  scenario: {
    title: string;
  };
}

export interface InterviewDetails {
  id: string;
  userId: string;
  scenarioId: string;
  currentStep: 'PRESENTATION' | 'PROBING' | 'VERDICT';
  turnCount: number;
  score: number | null;
  verdict: string | null;
  gapDetected: GapType | null;
  evidence: string | null;
  note: string | null;
  failures: Failure[] | null;
  history: Turn[];
  createdAt: string;
  scenario: {
    title: string;
    description: string;
  };
}

export const interviewApi = {
  start: (params: StartInterviewParams) =>
    request<InterviewResponse>('/interview/start', {
      method: 'POST',
      body: params,
    }),

  sendMessage: (params: SendMessageParams) =>
    request<InterviewResponse>('/interview/message', {
      method: 'POST',
      body: params,
    }),

  getHistory: (userId: string) =>
    request<HistoryItem[]>(`/interview/history/${userId}`, {
      method: 'GET',
    }),

  getDetails: (interviewId: string) =>
    request<InterviewDetails>(`/interview/details/${interviewId}`, {
      method: 'GET',
    }),

  delete: (interviewId: string) =>
    request<{ message: string }>(`/interview/${interviewId}`, {
      method: 'DELETE',
    }),
};
