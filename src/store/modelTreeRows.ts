import {
	fetchCreateRowInEntity,
	fetchDeleteRow,
	fetchUpdateRow,
} from '@/model/api.service';
import { IChangeRow } from '@/model/types';
import {
	applySnapshot,
	cast,
	destroy,
	flow,
	IAnyModelType,
	IMSTArray,
	Instance,
	types,
} from 'mobx-state-tree';

export const modelEntity = types.model({
	id: types.number,
	rowName: types.string,
});

export const modelRow = types.compose(
	types.model({
		equipmentCosts: types.number,
		estimatedProfit: types.number,
		mainCosts: types.number,
		overheads: types.number,
	}),
	modelEntity,
);

export const modelFullRow = types.compose(
	modelRow,
	types.model({
		machineOperatorSalary: types.number,
		materials: types.number,
		mimExploitation: types.number,
		salary: types.number,
		supportCosts: types.number,
		parentId: types.maybe(types.number),
	}),
);

export const modelTree = types.compose(
	types.model({
		child: types.array(types.late((): IAnyModelType => modelTree)),
		isNowCreate: types.maybe(types.boolean),
		total: types.number,
	}),
	modelFullRow,
);

export const modelEntityTree = types
	.model({
		tree: types.array(modelTree),
		isNowEdited: types.boolean,
	})
	.views((self) => ({
		get getTree() {
			return self.tree;
		},
		get getIsNowEdited() {
			return self.isNowEdited;
		},
		getTreeRowById(id: number) {
			const findRow = (
				tree: typeof self.tree,
				id: number,
			): Instance<typeof modelTree> | null => {
				for (const node of tree) {
					if (node.id === id) {
						return node;
					}
					const foundChild = findRow(node.child, id);
					if (foundChild !== null) {
						return foundChild;
					}
				}
				return null;
			};
			return findRow(self.tree, id);
		},
	}))
	.actions((self) => ({
		setTree(newTree: Instance<typeof modelTree>[]) {
			self.tree = cast(newTree);
		},
		setIsNowEdited(isNowEdited: boolean) {
			self.isNowEdited = isNowEdited;
		},
		setIsNowCreate(row: Instance<typeof modelTree>, isNowCreate: boolean) {
			row.isNowCreate = isNowCreate;
		},
		addRow(parentRow: Instance<typeof modelTree>) {
			const row: Instance<typeof modelTree> = {
				equipmentCosts: 0,
				estimatedProfit: 0,
				mainCosts: 0,
				overheads: 0,
				rowName: '',
				parentId: parentRow.id,
				child: [] as unknown as IMSTArray<IAnyModelType>,
				id: 0,
				machineOperatorSalary: 0,
				materials: 0,
				mimExploitation: 0,
				salary: 0,
				supportCosts: 0,
				total: 0,
				isNowCreate: true,
			};
			parentRow.child.unshift(row);
		},

		saveRow: flow(function* (row: Instance<typeof modelTree>) {
			try {
				const r: IChangeRow = yield fetchCreateRowInEntity(row);
				row.isNowCreate = false;
				applySnapshot(row, { ...row, ...r.current });
			} catch (e) {
				console.error(e);
			}
		}),

		updateRow: flow(function* (row: Instance<typeof modelTree>) {
			try {
				const r: IChangeRow = yield fetchUpdateRow(row);
				applySnapshot(row, { ...row, ...r.current });
				if (r.changed.length === 0) return;
				for (const changed of r.changed) {
					const rc = self.getTreeRowById(changed.id);
					if (rc === null) continue;
					applySnapshot(rc, { ...rc, ...changed });
				}
			} catch (e) {
				console.error(e);
			}
		}),

		deleteRow(row: Instance<typeof modelTree>) {
			row.id !== 0 && fetchDeleteRow(row.id);
			destroy(row);
		},
		changeRow(
			row: Instance<typeof modelTree>,
			newDataRow: Partial<Instance<typeof modelTree>>,
		) {
			applySnapshot(row, { ...row, ...newDataRow });
		},
	}));
