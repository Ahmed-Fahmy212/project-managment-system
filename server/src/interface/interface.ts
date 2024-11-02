export interface ProjectData {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
  }
  
export interface TaskData {
  id: number;
  title: string;
  description?: string;
  // status?: Status;
  // priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;

  // author?: User;
  // assignee?: User;
  // comments?: Comment[];
  // attachments?: Attachment[];
}