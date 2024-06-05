import { ReactNode } from "react";
import { roles, taskStatuses } from "./constants";

export type Role = keyof typeof roles
export type TaskStatus = keyof typeof taskStatuses

export type User = {
  id: string,
  isVerified: boolean,
  role: Role,
  address: string,
  name: string,
  email: {
    emailAddress: string,
    accessCode: string
  }
  phone: {
    phoneNumber: string,
    accessCode: string
  }
}

export type Message = {
  room: string,
  sender: string,
  text: string,
  timestamp: string
}


export type Task = {
  id: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  dueDate: {
    _seconds: number;
    _nanoseconds: number;
  };
  name: string;
  description: string;
  reporter: User;
  assignee: User;
  startDate: {
    _seconds: number;
    _nanoseconds: number;
  };
  status: TaskStatus
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
};

export type UserActionDialog = {
  data: User
  TriggerButton?: ReactNode,
  open: boolean
  handleOpen: () => void
}

export type TaskActionDialog = {
  data: Task
  TriggerButton?: ReactNode,
  open: boolean
  handleOpen: () => void
}