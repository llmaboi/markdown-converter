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

// TODO: Replace placeholder with VALUE
export type StringRowItem = RowItems & {
	type: 'string';
	value: string;
	text: string;
};

export type NodeRowItem = RowItems & {
	type: 'html';
	value: string;
};

export type NewRowItem = RowItems & {
	type: 'new';
	value: string;
};

export type JoinedRowItem = BooleanRowItem | StringRowItem | NodeRowItem | NewRowItem;
