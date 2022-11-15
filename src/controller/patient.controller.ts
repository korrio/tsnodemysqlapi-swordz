import { Request, Response } from 'express';
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2';
import { connection } from '../config/mysql.config';
import { HttpResponse } from '../domain/response';
import { Code } from '../enum/code.enum';
import { Status } from '../enum/status.enum';
import { Patient } from '../interface/patient';
import { Deposit } from '../interface/deposit';
import { QUERY } from '../query/patient.query';

type ResultSet = [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]];

export const getPatients = async (req: Request, res: Response): Promise<Response<Patient[]>> => {
  console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
  try {
    const pool = await connection();
    const result: ResultSet = await pool.query(QUERY.SELECT_PATIENTS);
    return res.status(Code.OK)
      .send(new HttpResponse(Code.OK, Status.OK, 'Patients retrieved', result[0]));
  } catch (error: unknown) {
    console.error(error);
    return res.status(Code.INTERNAL_SERVER_ERROR)
      .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred'));
  }
};

export const getPatient = async (req: Request, res: Response): Promise<Response<Patient>> => {
  console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
  try {
    const pool = await connection();
    const result: ResultSet = await pool.query(QUERY.SELECT_PATIENT, [req.params.patientId]);
    if (((result[0]) as Array<any>).length > 0) {
      return res.status(Code.OK)
        .send(new HttpResponse(Code.OK, Status.OK, 'Patient retrieved', result[0]));
    } else {
      return res.status(Code.NOT_FOUND)
        .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient not found'));
    }
  } catch (error: unknown) {
    console.error(error);
    return res.status(Code.INTERNAL_SERVER_ERROR)
      .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred'));
  }
};

export const createPatient = async (req: Request, res: Response): Promise<Response<Patient>> => {
  console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
  let patient: Patient = { ...req.body };
  try {
    const pool = await connection();
    const result: ResultSet = await pool.query(QUERY.CREATE_PATIENT, Object.values(patient));
    patient = { id: (result[0] as ResultSetHeader).insertId, ...req.body };
    return res.status(Code.CREATED)
      .send(new HttpResponse(Code.CREATED, Status.CREATED, 'Patient created', patient));
  } catch (error: unknown) {
    console.error(error);
    return res.status(Code.INTERNAL_SERVER_ERROR)
      .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred'));
  }
};

export const updatePatient = async (req: Request, res: Response): Promise<Response<Patient>> => {
  console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
  let patient: Patient = { ...req.body };
  try {
    const pool = await connection();
    const result: ResultSet = await pool.query(QUERY.SELECT_PATIENT, [req.params.patientId]);
    if (((result[0]) as Array<any>).length > 0) {
      const result: ResultSet = await pool.query(QUERY.UPDATE_PATIENT, [...Object.values(patient), req.params.patientId]);
      return res.status(Code.OK)
        .send(new HttpResponse(Code.OK, Status.OK, 'Patient updated', { ...patient, id: req.params.patientId }));
    } else {
      return res.status(Code.NOT_FOUND)
        .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient not found'));
    }
  } catch (error: unknown) {
    console.error(error);
    return res.status(Code.INTERNAL_SERVER_ERROR)
      .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred'));
  }
};

// /deposit 
// {
//         "address": "0x22f45E683b2574eFe3b2d82642E4176Fa1967c42",
//         "swords": 25000,
//         "rate": 10000,
//         "bnb": 2.5,
//         "tx": "0x9ec0d5777149adf94f8cc0008820250b20eaace3f63acc2da91d9efdfb039c67",
//         "block": 24607117
//     }
export const updateSwordzPatient = async (req: Request, res: Response): Promise<Response<Patient>> => {
  console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
  let deposit: Deposit = { ...req.body };
  console.log("deposit:",deposit);
  try {
    const pool = await connection();
    const patient: ResultSet = await pool.query(QUERY.SELECT_PATIENT_ADDRESS, [deposit.address]);
    // console.log("patient[0]",patient[0]);
    let arr = {...Object.values(patient)};
    if (((patient[0]) as Array<any>).length > 0) {
      const result: ResultSet = await pool.query(QUERY.UPDATE_SWORDZ, [deposit.swordz,1]);
      return res.status(Code.OK)
        .send(new HttpResponse(Code.OK, Status.OK, 'Swordz updated', { ...patient[0] }));
    } else {
      return res.status(Code.NOT_FOUND)
        .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient not found'));
    }
  } catch (error: unknown) {
    console.error(error);
    return res.status(Code.INTERNAL_SERVER_ERROR)
      .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred'));
  }
};

export const deletePatient = async (req: Request, res: Response): Promise<Response<Patient>> => {
  console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
  try {
    const pool = await connection();
    const result: ResultSet = await pool.query(QUERY.SELECT_PATIENT, [req.params.patientId]);
    if (((result[0]) as Array<any>).length > 0) {
      const result: ResultSet = await pool.query(QUERY.DELETE_PATIENT, [req.params.patientId]);
      return res.status(Code.OK)
        .send(new HttpResponse(Code.OK, Status.OK, 'Patient deleted'));
    } else {
      return res.status(Code.NOT_FOUND)
        .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient not found'));
    }
  } catch (error: unknown) {
    console.error(error);
    return res.status(Code.INTERNAL_SERVER_ERROR)
      .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred'));
  }
};
