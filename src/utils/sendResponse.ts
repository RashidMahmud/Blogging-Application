import type { Response } from "express";

type TMeta = {
  page: number;
  limit: number;
  total: number;
};

type TResponseData<T> = {
  success: boolean;
  statuscode: number;
  message: string;
  data: T;
  meta?: TMeta;
};

export const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
  res.status(data.statuscode).json({
    success: data.success,
    statuscode: data.statuscode,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};
