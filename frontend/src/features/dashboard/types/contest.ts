export interface ContestFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  subjects: string[];
}

export interface Subject {
  id: string;
  name: string;
  isSelected: boolean;
}
