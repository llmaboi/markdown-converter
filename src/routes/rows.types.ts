export type RowType = 'boolean' | 'string' | 'html' | 'new';

type RowItems = {
	type: RowType;
	text?: string;
	value: string | boolean;
};

export type BooleanRowItem = RowItems & {
	type: 'boolean';
	value: boolean;
	text: string;
};

export type StringRowItem = RowItems & {
	type: 'string';
	// replacer: string;
	value: string;
};

export type NodeRowItem = RowItems & {
	type: 'html';
	value: string;
};

export type NewRowItem = RowItems & {
	type: 'new';
	value: string;
};

export type JoinedRowItemNotNew = BooleanRowItem | StringRowItem | NodeRowItem;

export type JoinedRowItem = BooleanRowItem | StringRowItem | NodeRowItem | NewRowItem;
