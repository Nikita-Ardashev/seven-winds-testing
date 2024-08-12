import { IChangeRow, IEntity, IFullRow, ITree } from './types';

const API = 'http://185.244.172.108:8081';
export const EID = 137860;

export const fetchCreateEntity = async (): Promise<IEntity> => {
	const req = await fetch(API + `/v1/outlay-rows/entity/create`, {
		method: 'post',
	});
	const result = await req.json();
	return result;
};

export const fetchCreateRowInEntity = async (body: IEntity): Promise<IChangeRow> => {
	const req = await fetch(API + `/v1/outlay-rows/entity/${EID}/row/create`, {
		method: 'post',
		body: JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' },
	});
	const result = await req.json();
	return result;
};

export const fetchUpdateRow = async (body: IFullRow): Promise<IChangeRow> => {
	const req = await fetch(API + `/v1/outlay-rows/entity/${EID}/row/${body.id}/update`, {
		method: 'post',
		body: JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' },
	});
	const result = await req.json();
	return result;
};

export const fetchDeleteRow = async (rID: number): Promise<IChangeRow> => {
	const req = await fetch(API + `/v1/outlay-rows/entity/${EID}/row/${rID}/delete`, {
		method: 'delete',
	});
	const result = await req.json();
	return result;
};

export const fetchGetTreeRows = async (): Promise<ITree[]> => {
	const req = await fetch(API + `/v1/outlay-rows/entity/${EID}/row/list`, {
		method: 'get',
	});
	const result = await req.json();
	return result;
};
