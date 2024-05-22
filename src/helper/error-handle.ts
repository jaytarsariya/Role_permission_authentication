import { Response } from 'express';

export const BadRequest = async (response: Response, body: any) => {
  const code = body?.code || 400;
  return body
    ? response.status(code).send({
        status: false,
        code: code,
        error: { message: body ? body.message : 'somthing wrong !' },
      })
    : response.status(code).send({ status: false });
};

export const Ok = async (response: Response, message: String, body?: any) => {
  return response.send({
    status: true,
    code: 200,
    message: message ? message : null,
    data: body ? body : null,
  });
};
